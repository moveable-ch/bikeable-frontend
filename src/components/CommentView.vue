<template>
  <div class="comment">
    <div class="comment__avatar" :style="'background-image:url(' + comment.user.avatar.small + ')'"></div>
    <div class="comment__body">
      <div class="comment__meta">
        <span class="username">{{ comment.user.name }}</span><span class="date">{{ dateCreated }}</span>
      </div>
      <p>{{ comment.text }}</p>
    </div>
    <a @click.prevent="upvoteComment" href="#" class="comment__vote" v-bind:class="{ disabled: !isLoggedIn }">
      <span class="comment__vote__count">{{ comment.votesCount }}</span>
    </a>
  </div>
</template>

<script>
export default {
  name: 'comment-view',
  props: [
    'comment',
    'loadComments'
  ],
  data () {
    return {
      commentText: ''
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
    }
  },

  watch: {

  },

  mounted() {
  },

  methods: {
    upvoteComment() {
      if(!this.isLoggedIn) return;

      let userId = localStorage.getItem('userId');
      let token = localStorage.getItem('token');

      this.$store.commit('LOAD_START');
      this.$http.post('https://backend.bikeable.ch/api/v1/comments/' + this.comment._id + '/vote', {},
        {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': token
          }
        }).then(response => {
          this.$store.commit('LOAD_FINISH');
          this.loadComments();
        }, response => {
          let msg = 'Error';
          if(response.body.status) {
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
    padding-left: 3rem;

    &__avatar {
      width: 2.4rem;
      height: 2.4rem;
      background-color: #fff;
      background-size: cover;
      background-position: center;
      border-radius: 99%;
      margin-right: 1rem;
      position: absolute;
      top: 0;
      left: 0;
    }

    &__body {
      background-color: #fff;
      margin-bottom: 5px;
      padding: 1rem;
    }
    &__vote {
      display: block;
      text-decoration: none;
      color: #333;
      background-color: #fff;
      height: 2rem;
      text-align: center;
      position: relative;
      box-sizing: border-box;
      border: 2px solid #fff;
      transition: .3s border-color;

      &__count {
        font-weight: 500;
        line-height: 2rem;
        position: relative;
        padding-left: 1.5rem;

        &::before {
          content: "";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: .75rem;
          background: none;
          border: none;
          background-image: url('../assets/upvote-black.png');
          background-size: 100%;
          background-position: 50% 45%;
          background-repeat: no-repeat;
          transition: .3s transform $easeOutQuint;
        }
      }
      &.disabled {
        pointer-events: none;
      }
      &:hover {
        border-color: $c-main;

        .comment__vote__count {
          &::before {
            transform: translateY(-3px);
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
