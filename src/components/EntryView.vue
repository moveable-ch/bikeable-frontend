<template>
  <div class="entry clearfix">
    <div class="loader" :class="{ 'is-visible': loadingData }"></div>
    <div class="col">
      <img :src="currentEntry.image">
    </div>
    <div class="col">
      <div class="lead">
        <h1>{{ currentEntry.title }}</h1>
        <h2>{{ currentEntry.address }}</h2>
        <p>{{ currentEntry.text }}</p>
        <span class="username">— {{ currentEntry.user.name }}</span>
      </div>
      <div class="comments">
        <div class="notice" v-if="!isLoggedIn">Jetzt <router-link to="/register">registrieren</router-link> und mitdiskutieren!</div>
        <div class="comments__form" v-if="isLoggedIn">
          <form @submit.prevent="postComment">
            <textarea v-model="commentText" rows="4"></textarea>
            <button type="submit" class="btn">Kommentar abschicken</button>
          </form>
        </div>
        <div class="comments__item" v-for="comment in comments">
          <p>{{ comment.text }}</p>
          <span class="username">{{ comment.user.name }}</span>
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
    // max-width: 1200px;
    margin: 0;
    padding: 0;
    font-family: $f-body;

    img {
      max-width: 100%;
      height: auto;
    }
  }

  .col {
    box-sizing: border-box;
    padding: 1rem;

    &:first-child {
      padding: 0;
    }

    @include desktop() {
      width: 50%;
      float: left;
      padding: 1.5rem;

      &:first-child {
        padding: 1.5rem;
      }
    }
  }

  .lead {
    h1 {
      display: inline;
      line-height: 1;
      margin-top: 0;
      margin-bottom: 0;
    }
    h2 {
      margin-bottom: 1rem;
    }
    .username {
      display: block;
      margin: .5rem 0;
      padding-left: 1rem;
    }
  }

  .comments {
    margin-top: 2rem;

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
