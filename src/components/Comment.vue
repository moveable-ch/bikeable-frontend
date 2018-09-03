<template>
  <div class="comment" v-bind:class="{child: isChild}">
    <div class="comment__avatar" v-if="comment.user.avatar" :style="'background-image:url(' + comment.user.avatar.small + ')'"></div>
    <div class="comment__body">
      <div class="comment__meta">
        <span class="username">{{ comment.user.name }}</span><span class="date">{{ dateCreated }}</span>
      </div>
      <p v-html="linkifiedComment"></p>
    </div>
    <div class="comment__buttons" v-if="!isChild && isLoggedIn">
      <a @click.prevent="upvoteComment" href="#" class="comment__button comment__button--vote" v-bind:class="{ disabled: !isLoggedIn }">
        <span class="count">{{ comment.votesCount }}</span>
      </a>
      <a @click.prevent="showForm = !showForm" href="#" class="comment__button comment__button--reply">{{ $t('comment.reply') }}</a>
    </div>

    <div class="comment__reply" v-if="showForm">
      <div class="comment__reply__image" :style="'background-image:url(' + avatar + ')'"></div>
      <form @submit.prevent="postReply">
        <textarea :placeholder="$t('comment.comment')" v-model="replyText" rows="2"></textarea>
        <button type="submit" class="btn comment__reply__button" v-bind:class="{ 'disabled': !replyText }">{{ $t('comment.send') }}</button>
      </form>
    </div>

    <div class="comment__children" v-if="responses">
      <c-comment v-for="comment in responses" :isChild="true" :key="comment._id" :comment="comment" :loadComments="loadComments" :avatar="avatar"></c-comment>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
// import linkify from 'linkifyjs';
import linkifyHtml from 'linkifyjs/html';

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
    },
    linkifiedComment() {
      let regex = /<(?:.|\n)*?>/gm;
      let text = this.comment.text.replace(regex, '');
      text = linkifyHtml(text, {
        defaultProtocol: 'https',
        target: '_blank'
      });
      return text;
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

      axios.post(process.env.BACKEND_URL + '/api/v1/comments',
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
      axios.post(process.env.BACKEND_URL + '/api/v1/comments/' + this.comment._id + '/vote', {},
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
    font-size: .9rem;
    position: relative;
    padding-left: 2rem;

    @include tablet {
      padding-left: 3rem;
    }

    &.child {
      margin-top: .5rem;
      margin-bottom: 1.5rem;
    }

    &__reply {
      margin-top: 1.5rem;
      margin-bottom: 2rem;
      position: relative;
      padding-left: 2rem;

      &__image {
        width: 1.5rem;
        height: 1.5rem;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #fff;
        background-size: cover;
        border: 2px solid $c-blue;
        border-radius: 99%;
      }

      @include tablet {
        padding-left: 3rem;

        &__image {
          width: 2.5rem;
          height: 2.5rem;
        }
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
        border-color: $c-blue;
        // height: 4rem;
      }

      @include tablet {
        // margin-top: 2rem;
      }
    }

    &__avatar {
      width: 1.5rem;
      height: 1.5rem;
      background-color: #fff;
      background-size: cover;
      background-position: center;
      margin-right: 1rem;
      position: absolute;
      top: 0;
      left: 0;
      border: 2px solid $c-blue;
      border-radius: 4px;
      border-radius: 99%;

      @include tablet {
        width: 2.5rem;
        height: 2.5rem;
      }
    }

    &__body {
      background-color: #fff;
      border: 1px solid $c-blue;
      border-radius: 4px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      margin-bottom: 0px;
      padding: 1rem;
      overflow: hidden;

      p {
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      a {
        color: $c-black;
        text-decoration: underline;
      }
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
      border: 1px solid $c-blue;
      border-top: none;
      background-color: rgba($c-blue, .4);
      width: 100%;

      &:hover {
        background-color: rgba($c-blue, .8);
      }

      &--reply {
        border-bottom-right-radius: 4px;
      }
      &--vote {
        border-bottom-left-radius: 4px;
        border-right: none;

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
        color: $c-grey-darkest;
      }
    }
    p {
      margin-top: .5rem;

    }
  }


</style>
