<template>
  <div class="entry">
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
            <button type="submit" class="btn">Senden</button>
          </form>
        </div>
      </div>
      <div class="col">
        <div class="comments">
          <div class="comments__item" v-for="comment in comments">
            <p>{{ comment.text }}</p>
            <span class="username">{{ comment.user.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'entry-view',
  props: [],
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
        }
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
      this.entryId = this.$route.params.id;
      this.$store.commit('LOAD_START');

      this.$http.get('https://backend.bikeable.ch/api/v1/entries/'+this.entryId).then(response => {
        this.currentEntry = response.body.data;
        this.loadingData = false;
      }, response => {
        console.log(response);
      });

      this.$http.get('https://backend.bikeable.ch/api/v1/comments?entry='+this.entryId).then(response => {
        this.$store.commit('LOAD_FINISH');
        this.comments = response.body.data;
      }, response => {
        console.log(response);
      });
    },

    postComment() {
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
  }

  .col {
    padding-top: 3rem;
    box-sizing: border-box;

    &:first-child {
      padding-right: 0;
    }

    @include desktop() {
      width: 50%;
      float: left;

      &:first-child {
        padding-right: 1rem;
      }
    }
  }

  .lead {
    h1 {
      line-height: 1;
      margin: 0 0 .5rem 0;
      font-weight: 400;
    }
    h2 {
      margin-bottom: 1rem;
      font-weight: 400;
    }
    .meta {
      display: block;
      color: #888;
      margin-bottom: 1rem;
    }
  }

  .comments {
    &__form {
      margin-bottom: 2rem;
    }
    &__item {
      // border: 2px solid #ccc;
      background: white;
      margin: 1rem 0;
      padding: 1rem;

      .username {
        display: block;
        margin-top: .5rem;
        padding-left: 1rem;

        &::before {
          content: "— ";
        }
      }
    }
  }


</style>
