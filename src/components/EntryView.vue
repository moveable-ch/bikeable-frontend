<template>
  <div class="entry" v-bind:class="{ 'is-famed': currentEntry.famed, 'pending': loadingData }">
    <div class="entry__container" v-if="!loadingData">
      <div class="col">
        <entry-media-view
          :img="currentEntry.photo.large.url"
          :coords="currentEntry.coords">
        </entry-media-view>
        <div class="share">
          <a class="share__button share__button--fb" target="_blank" :href="'https://www.facebook.com/sharer/sharer.php?u=' + entryUrl"></a>
          <a class="share__button share__button--twitter" target="_blank" :href="'https://twitter.com/home?status=' + entryUrl"></a>
          <a class="share__button share__button--mail" :href="'mailto:?subject=' + currentEntry.title + '&body=' + entryUrl"></a>
        </div>
      </div>
      <div class="col">
        <div class="entry__user">
          <div v-if="currentEntry.user.avatar" class="entry__user__image" :style="'background-image:url(' + currentEntry.user.avatar.small + ')'"></div>
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
        <a href="#" class="vote" v-bind:class="{ 'is-active': hasVoted, disabled: !isLoggedIn }" @click.prevent="upvoteEntry">
          <span class="vote__icon vote__icon--main"></span>
          <span class="vote__icon vote__icon--white"></span>
          <span class="vote__count">{{ currentEntry.votes }}</span>
        </a>

        <div class="notice" v-if="!isLoggedIn">Jetzt <router-link to="/register">registrieren</router-link> und mitdiskutieren!</div>
        <div class="comments__form" v-if="isLoggedIn">
          <div class="comments__form__image"></div>
          <form @submit.prevent="postComment">
            <textarea placeholder="Kommentar" v-model="commentText" rows="2"></textarea>
            <button type="submit" class="btn comments__form__button" v-bind:class="{ 'disabled': !commentText }">Senden</button>
          </form>
        </div>

        <div class="comments">
          <comment-view v-for="comment in comments" :key="comment._id" :isChild="false" :comment="comment" :loadComments="loadComments" :entryId="entryId" :fetchData="fetchData"></comment-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommentView from '@/components/CommentView'
import EntryMediaView from '@/components/EntryMediaView'

export default {
  name: 'entry-view',
  // metaInfo() {
  //   return {
  //     title: this.currentEntry.title + ' — Bikeable'
  //   };
  // },
  head: {
    title: function () {
      return {
        inner: this.currentEntry.title
      }
    },
    meta: function () {
      return [
        { property: 'og:title', content: this.currentEntry.title + ' – Bikeable', id: 'og-title' },
        { property: 'og:image', content: this.currentEntry.photo.medium.url, id: 'og-image' },
        { property: 'og:image:width', content: this.currentEntry.photo.medium.width, id: 'og-image-width' },
        { property: 'og:image:height', content: this.currentEntry.photo.medium.height, id: 'og-image-height' },
        { property: 'og:url', content: this.entryUrl, id: 'og-url' },
        { property: 'og:desc', content: this.currentEntry.text, id: 'og-desc' }
      ]
    }
  },
  props: [],
  components: {
    'comment-view': CommentView,
    'entry-media-view': EntryMediaView
  },
  data () {
    return {
      entryId: 0,
      loadingData: true,
      hasVoted: false,
      currentEntry: {
        title: ' ',
        user: {
          name: ''
        },
        photo: {
          large: '',
          medium: ''
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
    },
    entryTitle() {
      if(!this.currentEntry.title) return 'what';
      return this.currentEntry.title;
    },
    userData() {
      return this.$store.state.userData;
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

      if(!this.isLoggedIn) return;
      this.checkUpvote();
    },

    loadEntry() {
      this.entryId = this.$route.params.id;
      this.$store.commit('LOAD_START');
      let self = this;

      this.$http.get('https://backend.bikeable.ch/api/v1/entries/'+this.entryId).then(response => {
        this.currentEntry = response.body.data;
        this.loadingData = false;
        this.$store.commit('LOAD_FINISH');
        self.$emit('updateHead');
      }, response => {
        this.$store.commit('LOAD_FINISH');
        console.log(response);
      });
    },

    loadComments() {
      this.$http.get('https://backend.bikeable.ch/api/v1/comments?entry='+this.entryId).then(response => {
        this.$store.commit('LOAD_FINISH');
        this.comments = response.body.data;
        /* temporarycomment sorting */
        // this.comments = comments.sort(function(a,b) {
        //   return new Date(b.createdAt) - new Date(a.createdAt);
        // });
      }, response => {
        this.$store.commit('LOAD_FINISH');
        console.log(response);
      });
    },

    postComment() {
      if(this.commentText == '') return;
      if(!this.isLoggedIn) return;

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
          if(response.status == 400) {
            this.hasVoted = true;
          }
        });

    },

    upvoteEntry() {
      if(!this.isLoggedIn) return;

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

          if(response.body.lastAction == 'addVote') {
            this.hasVoted = true;
          }else{
            this.hasVoted = false;
          }
        }, response => {
          let msg = response.body.message;
          this.$store.commit('SET_MESSAGE', msg);
          this.$store.commit('LOAD_FINISH');

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
    font-family: $f-head;
    min-height: calc(100vh - 600px);
    position: relative;

    &::before {
      content: "";
      display: none;
      width: 100%;
      height: 10rem;
      position: absolute;
      top: 0;
      left: 0;
      background-image: linear-gradient(-180deg, $c-highlight 0%, #F7F7F7 100%);
      opacity: .08;
    }

    &.pending {
      &::before {
        display: none;
      }
    }

    &__user {
      margin-bottom: 1rem;
      font-size: .8rem;
      display: flex;
      font-family: $f-head;
      background-color: #fafafa;
      padding: .5rem;
      border: 1px solid #eee;

      &__image {
        width: 2rem;
        height: 2rem;
        background-color: #fff;
        background-size: cover;
        background-position: center;
        margin-right: 1rem;
        border: 1px solid #eee;
      }
      &__content {

        span {
          line-height: 1.3;
        }
      }
      &__name {
        font-weight: bold;
      }
      &__date {
        color: #888;
      }
    }

    &__container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      max-width: 1500px;
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
      .vote {
        border-color: $c-main;
      }
      .vote.is-active, .vote:hover {
        background-color: $c-main;
      }
      .lead .btn-upvote.is-active {
        color: $c-main;
      }
    }

    @include desktop() {
      padding-bottom: 0;
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

      h1 {
        line-height: 1;
        margin: 0 0 .5rem 0;
        font-weight: bold;
        color: $c-highlight;
        font-size: 1.5rem;
      }
      h2 {
        margin-bottom: 1rem;
        font-size: .9rem;
        color: #888;
        font-weight: 400;
      }
      &__desc {
        font-size: .9rem;
        margin-bottom: 2rem;
      }
      &__meta {
        display: block;
        color: #888;
        border-bottom: 1px solid #444;
      }

      @include desktop() {
        // padding: 1.5rem;
      }
    }

    .vote {
      display: block;
      text-decoration: none;
      background-color: #fafafa;
      border: 1px solid $c-highlight;
      height: 3rem;
      margin-top: 5px;
      text-align: center;
      transition: .4s background-color;
      position: relative;
      overflow: hidden;
      // border-radius: 4px;

      &.disabled {
        pointer-events: none;
      }

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
        font-weight: bold;
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
      margin-top: 2rem;

      &__form {
        margin-top: 2rem;
        margin-bottom: 2rem;
        position: relative;
        padding-left: 2.5rem;

        &__image {
          width: 2rem;
          height: 2rem;
          position: absolute;
          top: 0;
          left: 0;
          background-color: #ffa;
        }

        label {
          margin-bottom: .5rem;
        }
        &__button {
          font-size: .8rem;
          min-width: 6rem;
          height: 2rem;
          line-height: 2rem;
        }

        textarea {
          padding: .5rem;
          font-size: .8rem;
          // height: 4rem;
        }

        @include desktop {
          margin-top: 4rem;
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
        background-color: #fafafa;
        background-size: 100%;
        background-position: center;
        margin-left: 5px;
        border: 1px solid #eee;
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
