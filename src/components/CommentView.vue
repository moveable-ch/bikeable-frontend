<template>
  <div class="comment">
    <div class="comment__meta">
      <span class="upvotes">{{ comment.votesCount }}</span>
      <button class="btn-upvote" @click.prevent="upvoteComment">▲</button>
      <span class="username">{{ comment.user.name }}</span>
      <span class="date">{{ dateCreated }}</span>
    </div>
    <p>{{ comment.text }}</p>
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
    }
  },

  watch: {

  },

  mounted() {
  },

  methods: {
    upvoteComment() {
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

<style lang="scss" scoped>

  @import '../styles/helpers';

  .comment {
    // border: 2px solid #ccc;
    background: white;
    margin: .5rem 0;
    // padding: 1rem;
    font-size: .8rem;
    border: 1px solid #ddd;

    &__meta {
      background-color: #f8f8f8;
      padding: .5rem 1rem;
      position: relative;

      .username {
        font-weight: 600;
      }
      .upvotes {
        font-weight: 600;
      }
      .date {
        position: absolute;
        right: 1rem;
        top: .5rem;
      }
      .btn-upvote {
        background-color: transparent;
        border: none;
        -webkit-appearance: none;
        padding: 0 .5rem 0 .1rem;
        font-size: .8rem;
        // color: $c-highlight;
        cursor: pointer;

        &:active, &:focus {
          outline: none;
        }
      }
    }
    p {
      padding: .5rem 1rem;
    }
  }


</style>
