<template>
  <div class="entry" v-bind:class="{ 'is-famed': currentEntry.famed }">
    <div class="entry__container">
      <div class="col">
        <div class="entry__image">
          <img :src="currentEntry.photo.large">
        </div>
        <div class="share">
          <a class="share__button share__button--fb" target="_blank" :href="'https://www.facebook.com/sharer/sharer.php?u=' + entryUrl"></a>
          <a class="share__button share__button--twitter" :href="'mailto:?subject=' + currentEntry.title + '&body=' + entryUrl"></a>
          <a class="share__button share__button--mail" :href="'mailto:?subject=' + currentEntry.title + '&body=' + entryUrl"></a>
        </div>
      </div>
      <div class="col">
        <div class="entry__user">
          <div v-if="currentEntry.user.image" class="entry__user__image" :style="'background-image:url(' + currentEntry.user.image + ')'"></div>
          <div class="entry__user__content">
            <span class="entry__user__name">{{ currentEntry.user.name }}</span><br>
            <span class="entry__user__date">{{ entryDate }}</span>
          </div>
        </div>
        <div class="lead">
          <h1>{{ currentEntry.title }}</h1>
          <h2>{{ currentEntry.address }}</h2>
          <p class="lead__desc">{{ currentEntry.text }}</p>
        </div>
        <a href="#" class="vote" v-bind:class="{ 'is-active': hasVoted }" @click.prevent="upvoteEntry">
          <span class="vote__icon vote__icon--main"></span>
          <span class="vote__icon vote__icon--white"></span>
          <span class="vote__count">{{ currentEntry.votes }}</span>
        </a>

        <!--<div class="notice" v-if="!isLoggedIn">Jetzt <router-link to="/register">registrieren</router-link> und mitdiskutieren!</div>-->
        <div class="comments__form" v-if="isLoggedIn">
          <form @submit.prevent="postComment">
            <label>
              <span>Kommentar</span>
              <textarea v-model="commentText" rows="4"></textarea>
            </label>
            <button type="submit" class="btn" v-bind:class="{ 'disabled': !commentText }">Senden</button>
          </form>
        </div>

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
      hasVoted: false,
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
    },
    entryUrl() {
      return 'https://beta.bikeable.ch' + this.$route.fullPath;
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
      this.checkUpvote();
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

    checkUpvote() {

      let userId = localStorage.getItem('userId');
      let token = localStorage.getItem('token');

      this.$http.get('https://backend.bikeable.ch/api/v1/votes/' + this.entryId,
        {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': token
          }
        }).then(response => {
          this.hasVoted = false;
        }, response => {
          this.hasVoted = true;
        });

    },

    upvoteEntry() {
      let userId = localStorage.getItem('userId');
      let token = localStorage.getItem('token');

      this.$store.commit('LOAD_START');
      this.hasVoted = true;

      this.$http.post('https://backend.bikeable.ch/api/v1/votes/' + this.currentEntry._id, {},
        {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': token
          }
        }).then(response => {
          this.$store.commit('LOAD_FINISH');
          this.loadEntry();
          this.checkUpvote();
        }, response => {
          let msg = response.body.message;
          this.$store.commit('SET_MESSAGE', msg);
          this.$store.commit('LOAD_FINISH');

          this.hasVoted = false;
        });
    }
  }
}
</script>

<style lang="scss">

  @import '../styles/helpers';

  .entry {
    margin: 0;
    padding-bottom: 2rem;
    font-family: $f-body;
    min-height: calc(100vh - 600px);
    position: relative;

    &::before {
      content: "";
      display: block;
      width: 100%;
      height: 10rem;
      position: absolute;
      top: 0;
      left: 0;
      background-image: linear-gradient(-180deg, $c-highlight 0%, #F7F7F7 100%);
      opacity: .08;
    }

    &__user {
      margin-bottom: 1rem;
      font-size: .8rem;
      display: flex;

      &__image {
        width: 2.4rem;
        height: 2.4rem;
        background-color: #fff;
        border-radius: 99%;
        margin-right: 1rem;
      }
      &__content {

        span {
          line-height: 1.3;
        }
      }
      &__name {
        font-weight: 500;
      }
      &__date {
        color: #888;
      }
    }

    &__image {
      display: block;
      margin: 0 auto;
      margin-bottom: 1rem;
      width: 100%;
      height: 15rem;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
      }

      @include desktop() {
        height: 45rem;
        margin-bottom: 0;

        img {
          max-width: calc(100% - 2rem);
          max-height: calc(100% - 2rem);
        }
      }
    }

    &__container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      max-width: 1300px;
      margin: 0 auto;
      // padding: 0 1rem;
    }

    &.is-famed {
      &::before {
        background-image: linear-gradient(-180deg, $c-main 0%, #F7F7F7 100%);
      }
      .lead h1 {
        color: $c-main;
      }
      .vote__count {
        color: $c-main;
      }
      .vote__icon--main {
        background-image: url('../assets/upvote-green.png');
      }
      .vote.is-active, .vote:hover {
        background-color: $c-main;
      }
      .lead .btn-upvote.is-active {
        color: $c-main;
      }
    }

    @include desktop() {
      padding-bottom: 4rem;
    }
    .col {
      box-sizing: border-box;
      position: relative;
      z-index: 1;
      width: 100%;

      &:first-child {
        padding-right: 0;
      }
      &:nth-child(2) {
        padding: 0 1rem;
      }

      @include desktop() {
        width: 49%;

        &:first-child {
          padding-top: 2rem;
          width: 50%;;
          padding-left: 2rem;
        }
        &:nth-child(2) {
          width: 50%;
          padding-top: 2rem;
          padding-right: 2rem;
          padding-left: 2rem;
        }
      }
    }

    .lead {
      background-color: #fff;
      padding: 1rem;

      h1 {
        line-height: 1;
        margin: 0 0 .5rem 0;
        font-weight: 500;
        color: $c-highlight;
        font-size: 1rem;
      }
      h2 {
        margin-bottom: 1rem;
        font-size: .9rem;
        color: #888;
        font-weight: 400;
      }
      &__desc {
        font-size: .9rem;
      }
      &__meta {
        display: block;
        color: #888;
      }

      @include desktop() {
        padding: 1.5rem;
      }
    }

    .vote {
      display: block;
      text-decoration: none;
      background-color: #fff;
      height: 3rem;
      margin-top: 5px;
      text-align: center;
      transition: .4s background-color;
      position: relative;
      overflow: hidden;

      &:hover, &.is-active {
        background-color: $c-highlight;

        .vote__count {
          color: #fff;
        }
        .vote__icon {
          &--main {
            transform: translateY(-3rem);
          }
          &--white {
            transform: translateY(0);
          }
        }
      }
      &__count {
        line-height: 3rem;
        color: $c-highlight;
        font-weight: 500;
        font-size: 1.75rem;
        transition: .4s color;
      }
      &__icon {
        display: inline-block;
        width: 22px;
        height: 100%;
        background-image: url('../assets/upvote-red.png');
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        margin-right: .5rem;
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -3rem;
        transition: .4s transform $easeInOutQuint;

        &--white {
          background-image: url('../assets/upvote-white.png');
          transform: translateY(3rem);
        }
      }
    }

    .comments {
      &__form {
        margin-top: 3rem;
        margin-bottom: 2rem;

        @include desktop {
          // margin-top: 2rem;
        }
      }
    }

    .share {
      margin-top: 5px;
      display: none;
      justify-content: flex-end;

      &__button {
        display: block;
        width: 40px;
        height: 40px;
        background-color: #fff;
        background-size: 100%;
        background-position: center;
        margin-left: 5px;
        border: 2px solid #fff;
        transition: .2s border-color;

        &--fb {
          background-image: url('../assets/share-fb.png');
        }
        &--twitter {
          background-image: url('../assets/share-twitter.png');
        }
        &--mail {
          background-image: url('../assets/share-mail.png');
        }

        &:hover {
          border-color: $c-main;
        }

      }
      @include desktop() {
        display: flex;
      }
    }
  }



</style>
