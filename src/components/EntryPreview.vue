<template>
  <div class="entry-preview" v-bind:class="{ famed: entry.famed }">
      <router-link :to="'/entries/' + entry._id" class="entry-preview__image" :style="{ backgroundImage: 'url(' + entry.photo.medium.url + ')' }"></router-link>
      <span class="entry-preview__content">
        <span class="entry-preview__location">{{ entry.address }}</span>
        <h3 class="entry-preview__headline"><router-link :to="'/entries/' + entry._id">{{ entry.title }}</router-link></h3>
        <!--<span class="entry-preview__date">{{ formatDate(entry.createdAt) }} — {{ entry.user.name }}</span>-->
        <!--<span v-if="entry.humanizedDistance" class="entry-preview__distance">{{ entry.humanizedDistance }} entfernt</span>-->
        <span class="entry-preview__meta entry-preview__meta--votes">{{ entry.votes }}</span>
        <span class="entry-preview__meta entry-preview__meta--comments">{{ entry.commentCount }}</span>
      </span>
    </router-link>
  </div>
</template>

<script>

export default {
  name: 'c-entry-preview',
  props: ['entry'],
  data () {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    formatDate(date) {
      if(!date) return '';
      let d = new Date(date);
      return d.toLocaleDateString('de-DE');
    }
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.entry-preview {
  width: 100%;
  color: $c-black;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 1rem 0;

  @include tablet {
    width: calc(50% - 1rem);
  }
  @include desktop {
    width: calc(33.3% - 1rem);
  }

  &__image {
    display: block;
    width: 100%;
    height: 200px;
    background-size: cover;
    background-position: center;
    margin-bottom: .5rem;
    border-radius: 4px;
    box-shadow: 0 5px 15px -5px rgba($c-black, .2);
  }
  &__location {
    font-size: .7rem;
    color: $c-grey-darkest;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__headline {
    line-height: 1.2;
    margin-bottom: .5rem;

    a {
      font-size: 1rem;
      color: $c-black;
      font-weight: 600;
    }
  }
  &__meta {
    position: relative;
    display: inline-block;
    padding-left: 24px;
    margin-right: 1rem;
    font-family: $f-body;
    font-size: .8rem;
    font-weight: 600;
    color: $c-grey-darkest;

    &::before {
      content: "";
      display: block;
      width: 18px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      opacity: .5;
    }
    &--votes::before {
      background-image: url('../assets/upvote-small-filled.png');
      @include retina {
        background-image: url('../assets/upvote-small-filled@2x.png');
      }
    }
    &--comments {
      padding-left: 26px;
    }
    &--comments::before {
      background-image: url('../assets/comment-small-filled.png');
      @include retina {
        background-image: url('../assets/comment-small-filled@2x.png');
      }
    }
  }
}


</style>
