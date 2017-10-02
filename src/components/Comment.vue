<template>
  <div class="comment" v-bind:class="{child: isChild}">
    <div class="comment__avatar" v-if="comment.user.avatar" :style="'background-image:url(' + comment.user.avatar.small + ')'"></div>
    <div class="comment__body">
      <div class="comment__meta">
        <span class="username">{{ comment.user.name }}</span><span class="date">{{ dateCreated }}</span>
      </div>
      <p>{{ comment.text }}</p>
    </div>
    <div class="comment__buttons" v-if="!isChild && isLoggedIn">
      <a @click.prevent="upvoteComment" href="#" class="comment__button comment__button--vote" v-bind:class="{ disabled: !isLoggedIn }">
        <span class="count">{{ comment.votesCount }}</span>
      </a>
      <a @click.prevent="showForm = !showForm" href="#" class="comment__button comment__button--reply">Antworten</a>
    </div>

    <div class="comment__reply" v-if="showForm">
      <div class="comment__reply__image" :style="'background-image:url(' + avatar + ')'"></div>
      <form @submit.prevent="postReply">
        <textarea placeholder="Kommentar" v-model="replyText" rows="2"></textarea>
        <button type="submit" class="btn comment__reply__button" v-bind:class="{ 'disabled': !replyText }">Senden</button>
      </form>
    </div>

    <div class="comment__children" v-if="responses">
      <c-comment v-for="comment in responses" :isChild="true" :key="comment._id" :comment="comment" :loadComments="loadComments" :avatar="avatar"></c-comment>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'c-comment',
  props: [
    'entryId',
    'fetchData',
    'comment',
    'loadComments',
    'isChild',
    'avatar'
  ],
  data () {
    return {
      replyText: '',
      showForm: false
    }
  },

  computed: {
    dateCreated() {
      if(!this.comment.createdAt) return '';
      let d = new Date(this.comment.createdAt);
      return d.toLocaleDateString('de-DE');
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    responses() {
      return this.comment.responses;
    }
  },

  watch: {

  },

  mounted() {
  },

  methods: {
    postReply() {
      if(this.commentText == '') return;
      if(!this.isLoggedIn) return;

      let userId = localStorage.getItem('userId');
      let token = localStorage.getItem('token');

      this.$store.commit('LOAD_START');

      axios.post('https://backend.bikeable.ch/api/v1/comments',
        {
          'entryId': this.entryId,
          'parentId': this.comment._id,
          'text': this.replyText,
          'user': {
            '_id': userId
          }
        },
        {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': token
          }
        }).then(response => {
          this.replyText = '';
          this.showForm = false;
          this.fetchData();
        });
    },
    upvoteComment() {
      if(!this.isLoggedIn) return;

      let userId = localStorage.getItem('userId');
      let token = localStorage.getItem('token');

      this.$store.commit('LOAD_START');
      axios.post('https://backend.bikeable.ch/api/v1/comments/' + this.comment._id + '/vote', {},
        {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': token
          }
        }).then(response => {
          this.$store.commit('LOAD_FINISH');
          this.loadComments();
        }, error => {
          let msg = 'Error';
          if(error.request.data.status) {
            let msg = response.body.status + ': ' + response.body.message;
          }
          this.$store.commit('SET_MESSAGE', msg);
          this.$store.commit('LOAD_FINISH');
        });
    }
  }
}
</script>

<style lang="scss">

  @import '../styles/helpers';

  .comment {
    margin-bottom: 1rem;
    font-size: .8rem;
    position: relative;
    padding-left: 2.5rem;

    &.child {
      margin-top: .5rem;
      margin-bottom: .5rem;
    }

    &__reply {
      margin-top: 1rem;
      margin-bottom: 2rem;
      position: relative;
      padding-left: 2.5rem;

      &__image {
        width: 2rem;
        height: 2rem;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #fff;
        background-size: cover;
        border: 1px solid $c-grey-dark;
      }

      label {
        margin-bottom: .5rem;
      }
      &__button {
        margin-top: 4px;
      }

      textarea {
        display: block;
        padding: .5rem;
        font-size: .8rem;
        // height: 4rem;
      }

      @include desktop {
        // margin-top: 2rem;
      }
    }

    &__avatar {
      width: 2rem;
      height: 2rem;
      background-color: #fff;
      background-size: cover;
      background-position: center;
      margin-right: 1rem;
      position: absolute;
      top: 0;
      left: 0;
      border: 1px solid $c-grey-dark;
    }

    &__body {
      background-color: $c-grey;
      border-radius: 4px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      margin-bottom: 0px;
      padding: 1rem;
    }
    &__buttons {
      display: flex;
      justify-content: space-between;
    }
    &__button {
      display: block;
      text-decoration: none;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      color: #666;
      border: 1px solid $c-grey-dark;
      background-color: $c-grey;
      width: 100%;

      &:hover {
        background-color: $c-grey-dark;
      }

      &--reply {
        border-bottom-right-radius: 4px;
      }
      &--vote {
        border-bottom-left-radius: 4px;

        .count {
          font-weight: 400;
          line-height: 1.5rem;
          position: relative;
          padding-left: 1.25rem;
          color: $c-black;

          &::before {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 18px;
            background: none;
            border: none;
            background-image: url('../assets/upvote-small-filled.png');
            background-size: 100%;
            background-position: 50% 45%;
            background-repeat: no-repeat;
            transition: .3s transform $easeOutQuint;

            @include retina {
              background-image: url('../assets/upvote-small-filled@2x.png');
            }
          }
        }
      }
    }

    &__meta {
      margin-bottom: .2rem;
      position: relative;

      .username {
        font-weight: 600;
      }
      .date {
        position: absolute;
        top: 0;
        right: 0;
        color: #888;
      }
    }
    p {
      margin-top: .5rem;

    }
  }


</style>