<template>
  <div class="comment">
    <span class="username">{{ comment.user.name }}, {{ dateCreated }}</span>
    <p>{{ comment.text }}</p>
    <span class="upvotes">{{ comment.votesCount }} — <a href="#" @click.prevent="upvoteComment">upvote</a></span>
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
    margin: 1rem 0;
    padding: 1rem;
    font-size: .85rem;
    border: 1px solid #ddd;

    .username {
      color: $c-main;
      display: block;
    }
    .upvotes {
      display: block;
      margin-top: .5rem;
    }
  }


</style>
