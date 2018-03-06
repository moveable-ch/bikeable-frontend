<!-- /entries/{id} -->

<template>
  <div class="entry" v-bind:class="{ 'is-famed': currentEntry.famed, 'is-fixed': currentEntry.fixed, 'pending': loadingData }">
    <div class="entry__container" v-if="!loadingData">
      <div class="col">
        <entry-media-view
          :img="currentEntry.photo.large.url"
          :coords="currentEntry.coords"
          :entryUrl="entryUrl"
          :title="currentEntry.title">
        </entry-media-view>
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
          <span v-if="currentEntry.fixed" class="lead__fixed">Fixed!</span>
          <h1>{{ currentEntry.title }}</h1>
          <span class="lead__location">{{ currentEntry.address }}</span>
          <p class="lead__desc">{{ currentEntry.text }}</p>
          <p v-if="currentEntry.fixed" class="lead__notice lead__notice--good">Dieser Spot wurde in der Zwischenzeit verbessert.</p>
        </div>
        <a href="#" class="vote" v-bind:class="{ 'is-active': hasVoted, disabled: !isLoggedIn }" @click.prevent="upvoteEntry">
          <span class="vote__icon vote__icon--main"></span>
          <span class="vote__icon vote__icon--white"></span>
          <span class="vote__count">{{ currentEntry.votes }}</span>
        </a>

        <div class="notice" v-if="!isLoggedIn">Jetzt <router-link to="/register">registrieren</router-link> und mitdiskutieren!</div>
        <div class="comments__form" v-if="isLoggedIn && userData">
          <div class="comments__form__image" :style="'background-image:url(' + userAvatar + ')'"></div>
          <form @submit.prevent="postComment">
            <textarea placeholder="Kommentar" v-model="commentText" rows="2"></textarea>
            <button type="submit" class="btn comments__form__button" v-bind:class="{ 'disabled': !commentText }">Senden</button>
          </form>
        </div>

        <div class="comments" v-if="comments">
          <comment-view v-for="comment in comments" :key="comment._id" :isChild="false" :comment="comment" :loadComments="loadComments" :entryId="entryId" :fetchData="fetchData" :avatar="userAvatar"></comment-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Comment from '@/components/Comment'
import EntryMedia from '@/components/EntryMedia'

import spots from '../api/spots'
import comments from '../api/comments'

export default {
  name: 'v-entry',
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
    'comment-view': Comment,
    'entry-media-view': EntryMedia
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
      return this.$store.getters.entries
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
      return 'https://bikeable.ch' + this.$route.fullPath;
    },
    entryTitle() {
      if(!this.currentEntry.title) return 'what';
      return this.currentEntry.title;
    },
    userData() {
      return this.$store.getters.userData;
    },
    userAvatar() {
      if(!this.userData.profile) return '';
      return this.userData.profile.avatar.small;
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

      spots.getSpotById(this.entryId)
        .then((data) => {
          this.currentEntry = data;
          this.loadingData = false;
          this.$store.commit('LOAD_FINISH');
          this.$emit('updateHead');
        },
        (error) => {
          this.$store.commit('LOAD_FINISH');
          this.$router.push('/entries');
          this.$store.dispatch('handleError', 'Spot nicht gefunden');
        });
    },

    loadComments() {
      this.$store.commit('LOAD_START');

      comments.getCommentsBySpot(this.entryId)
      .then((data) => {
          this.comments = data;
          this.$store.commit('LOAD_FINISH');
        },
        (error) => {
          this.$store.commit('LOAD_FINISH');
          this.$store.dispatch('handleError', error);
        });
    },

    postComment() {
      if(this.commentText == '') return;
      if(!this.isLoggedIn) return;

      let userId = localStorage.getItem('userId');
      let token = localStorage.getItem('token');

      this.$store.commit('LOAD_START');

      comments.postComment({
        entryId: this.entryId,
        comment: this.commentText,
        userId: userId,
        authToken: token
      })
      .then((data) => {
        this.commentText = '';
        this.fetchData();
        this.$store.commit('LOAD_FINISH');
      },
      (error) => {
        this.$store.dispatch('handleError', error);
        this.$store.commit('LOAD_FINISH');
      });
    },

    checkUpvote() {
      let userId = localStorage.getItem('userId');
      let token = localStorage.getItem('token');

      spots.checkUpvote(
        {
          spotId: this.entryId,
          userId: userId,
          authToken: token
        }
      ).then(
        () => this.hasVoted = true,
        () => this.hasVoted = false
      );

    },

    upvoteEntry() {
      if(!this.isLoggedIn) return;

      let userId = localStorage.getItem('userId');
      let token = localStorage.getItem('token');

      this.$store.commit('LOAD_START');
      this.hasVoted = true;

      spots.upvoteSpot(
        {
          spotId: this.entryId,
          userId: userId,
          authToken: token
        })
        .then((data) => {
          this.$store.commit('LOAD_FINISH');

          if(data.lastAction == 'addVote') {
            this.hasVoted = true;
          }else{
            this.hasVoted = false;
          }
          this.loadEntry();
        },
        (error) => {
          this.$store.commit('SET_MESSAGE', error);
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
    padding-bottom: 4rem;
    font-family: $f-body;
    min-height: calc(100vh - 600px);
    position: relative;
    background-color: $c-grey;
    margin-bottom: -1rem;

    @include desktop {
      padding-top: 6rem;
      margin-bottom: -8rem;
    }

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
      margin-bottom: 1.5rem;
      font-size: .8rem;
      display: flex;
      align-items: center;
      background-color: #fff;
      padding: .25rem;
      border: 1px solid $c-grey-dark;
      border-radius: 4px;

      &__image {
        width: 2.5rem;
        height: 2.5rem;
        background-color: #fff;
        background-size: cover;
        background-position: center;
        margin-right: .75rem;
        border: 1px solid $c-grey-dark;
        border-radius: 4px;
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
    &.is-fixed {
      .lead h1 {
      }
    }

    .col {
      box-sizing: border-box;
      position: relative;
      width: 100%;

      &:first-child {
        padding-right: 0;
        z-index: 2;
      }
      &:nth-child(2) {
        padding: 0 1rem;
        z-index: 1;
        padding-top: 1rem;
      }

      @include desktop() {
        width: 49%;

        &:first-child {
          padding-top: 2rem;
          width: 40%;;
          padding-left: 2rem;
        }
        &:nth-child(2) {
          width: 60%;
          padding-top: 2rem;
          padding-right: 2rem;
          padding-left: 2rem;
        }
      }
    }

    .lead {

      h1 {
        display: block;
        font-family: $f-body;
        // color: $c-highlight;
        margin: 0 0 .5rem 0;
        text-transform: none;
        font-weight: 400;
        font-size: 1.25rem;
        text-align: left;
        text-shadow: none;
        transform: none;
      }
      &__location {
        display: block;
        font-family: $f-body;
        text-transform: none;
        margin-bottom: 1rem;
        font-size: 1rem;
        color: #888;
        font-weight: 400;
        line-height: 1.2;
      }
      &__desc {
        font-size: 1rem;
      }
      &__meta {
        display: block;
        color: #888;
        border-bottom: 1px solid #444;
      }
      &__notice {
        // font-size: .8rem;
        margin: 2rem 0;
        padding: 1rem .5rem;
        line-height: 1.2;
        background-color: $c-grey;
        text-align: center;

        &--good {
          color: $c-main;
          border: 1px solid $c-main;
          border-radius: 4px;
          box-shadow: 0 2px 0 0 rgba($c-main, .15);
        }
      }
      &__fixed {
        display: inline-block;
        background-color: $c-main;
        font-size: .8rem;
        padding: 5px 10px;
        color: #fff;
        font-weight: bold;
        margin-left: -5px;
        transform: rotate(-4deg);
      }

      @include desktop() {
        // padding: 1.5rem;
      }
    }

    .vote {
      display: block;
      text-decoration: none;
      background-color: $c-grey;
      border: 2px solid $c-highlight;
      height: 3rem;
      margin-top: 2rem;
      text-align: center;
      transition: .4s background-color;
      position: relative;
      overflow: hidden;
      border-radius: 4px;

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
        font-weight: 400;
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
          background-color: #fff;
          border: 1px solid $c-grey-dark;
          background-size: cover;
          background-position: center;
        }

        label {
          margin-bottom: .5rem;
        }
        &__button {
          min-width: 6rem;
          height: 2rem;
          line-height: 2rem;
          margin: 0;
        }

        textarea {
          padding: .5rem;
          font-size: .8rem;
          border-color: $c-grey-dark;
          margin-bottom: .25rem;
          // height: 4rem;
        }

        @include desktop {
          margin-top: 4rem;
        }
      }
    }
  }



</style>
