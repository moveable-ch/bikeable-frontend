<template>
  <div class="entry" v-bind:class="{ 'is-famed': currentEntry.famed }">
    <div class="container clearfix">
      <div class="col">
        <img :src="currentEntry.photo.large">
      </div>
      <div class="col">
        <div class="lead">
          <span class="meta">{{ entryDate }} — {{ currentEntry.user.name }}</span>
          <h1>{{ currentEntry.title }}</h1>
          <h2>{{ currentEntry.address }}</h2>
          <p>{{ currentEntry.text }}</p>
          <span class="upvotes">{{ currentEntry.votes }}</span>
          <button @click.prevent="upvoteEntry">Upvote</button>
        </div>
      </div>
    </div>
    <div class="container clearfix">
      <div class="col">
        <div class="notice" v-if="!isLoggedIn">Jetzt <router-link to="/register">registrieren</router-link> und mitdiskutieren!</div>
        <div class="comments__form" v-if="isLoggedIn">
          <form @submit.prevent="postComment">
            <label>
              <span>Kommentar</span>
              <textarea v-model="commentText" rows="4"></textarea>
            </label>
            <button type="submit" class="btn" v-bind:class="{ 'disabled': !commentText }">Senden</button>
          </form>
        </div>
      </div>
      <div class="col">
        <div class="comments">
          <comment-view v-for="comment in comments" :key="comment._id" :comment="comment" :loadComments="loadComments"></comment-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommentView from '@/components/CommentView'

export default {
  name: 'entry-view',
  props: [],
  components: {
    'comment-view': CommentView
  },
  data () {
    return {
      entryId: 0,
      loadingData: true,
      currentEntry: {
        user: {
          name: ''
        },
        photo: {
          large: ''
        },
        famed: false
      },
      comments: {},
      commentText: ''
    }
  },

  computed: {
    entries() {
      return this.$store.state.entries
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    entryDate() {
      if(!this.currentEntry.createdAt) return '';
      let d = new Date(this.currentEntry.createdAt);
      return d.toLocaleDateString('de-DE');
    }
  },

  watch: {
    '$route' (to, from) {
      this.fetchData();
    }
  },

  mounted() {
    this.comments = null;
    this.fetchData();
  },

  methods: {
    fetchData() {
      this.loadEntry();
      this.loadComments();
    },

    loadEntry() {
      this.entryId = this.$route.params.id;
      this.$store.commit('LOAD_START');

      this.$http.get('https://backend.bikeable.ch/api/v1/entries/'+this.entryId).then(response => {
        this.currentEntry = response.body.data;
        this.loadingData = false;
        this.$store.commit('LOAD_FINISH');
      }, response => {
        this.$store.commit('LOAD_FINISH');
        console.log(response);
      });
    },

    loadComments() {
      this.$http.get('https://backend.bikeable.ch/api/v1/comments?entry='+this.entryId).then(response => {
        this.$store.commit('LOAD_FINISH');
        this.comments = response.body.data;
      }, response => {
        this.$store.commit('LOAD_FINISH');
        console.log(response);
      });
    },

    postComment() {
      if(this.commentText == '') return;

      let userId = localStorage.getItem('userId');
      let token = localStorage.getItem('token');

      this.$store.commit('LOAD_START');

      this.$http.post('https://backend.bikeable.ch/api/v1/comments',
        {
          'entryId': this.entryId,
          'text': this.commentText,
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
          this.commentText = '';
          this.fetchData();
        });
    },

    upvoteEntry() {
      let userId = localStorage.getItem('userId');
      let token = localStorage.getItem('token');

      this.$store.commit('LOAD_START');

      this.$http.post('https://backend.bikeable.ch/api/v1/votes/' + this.currentEntry._id, {},
        {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': token
          }
        }).then(response => {
          console.log(response);
          this.$store.commit('LOAD_FINISH');
          this.loadEntry();
        }, response => {
          let msg = response.body.message;
          this.$store.commit('SET_MESSAGE', msg);
          this.$store.commit('LOAD_FINISH');
        });
    }
  }
}
</script>

<style lang="scss" scoped>

  @import '../styles/helpers';

  .entry {
    margin: 0;
    padding-bottom: 2rem;
    font-family: $f-body;

    img {
      max-width: 100%;
      height: auto;
    }

    &.is-famed {
      h1 {
        color: $c-main;
      }
    }
  }

  .col {
    padding-top: 2rem;
    box-sizing: border-box;

    &:first-child {
      padding-right: 0;
    }

    @include desktop() {
      width: 50%;
      float: left;
      padding-top: 3rem;

      &:first-child {
        padding-right: 1rem;
      }
    }
  }

  .lead {
    h1 {
      line-height: 1;
      margin: .5rem 0 .5rem 0;
      font-weight: 400;
      color: $c-highlight;
    }
    h2 {
      margin-bottom: 1rem;
      font-weight: 400;
    }
    .meta {
      display: block;
      color: #888;
    }
    .upvotes {
      display: block;
      font-size: 2.75rem;
      margin-top: 1rem;
    }
  }

  .comments {
    &__form {
      margin-bottom: 0rem;

      @include desktop {
        margin-top: 2rem;
      }
    }
  }


</style>
