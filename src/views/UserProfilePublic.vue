<!-- /users/{id} -->

<template>
  <div class="v-user" v-if="userProfileData">
    <div class="container">
      <div class="v-user__avatar" v-if="userAvatar">
        <img :src="userProfileAvatar">
      </div>
      <h1>{{ userProfileData.username }}</h1>
      <p class="v-user__bio" v-if="userProfileData.profile.bio">{{ userProfileData.profile.bio }}</p>
    </div>
    <div class="container">
      <!-- <span class="entrycount">{{ userEntryCount }} Spots</span> -->
      <div class="v-user__spots" v-if="userProfileData">
        <div class="v-user__spots__item" v-for="entry in userProfileData.entries" :key="entry._id">
          <c-entry-preview :entry="entry"></c-entry-preview>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import users from '../api/users'
import EntryPreview from '@/components/EntryPreview';

export default {
  name: 'v-user-profile',
  data () {
    return {
      userId: null,
      dataLoaded: false,
      userProfileData: null
    }
  },
  components: {
    'c-entry-preview': EntryPreview
  },
  computed: {
    userData() {
      return this.$store.getters.userData;
    },
    userAvatar() {
      if(!this.userData.profile) return null;
      if(!this.userData.profile.avatar) return null;
      if(this.imageId) {
        return this.imagePreviewUrl;
      }
      return this.userData.profile.avatar.small;
    },
    userProfileAvatar() {
      if(!this.userProfileData.profile) return null;
      if(!this.userProfileData.profile.avatar) return null;
      return this.userProfileData.profile.avatar.small;
    },
    imagePreviewUrl() {
      return process.env.BACKEND_URL + '/api/v1/photos/' + this.imageId + '?size=small';
    },
    userEntryCount() {
      if(!this.userProfileData.entries) return 0;
      return this.userProfileData.entries.length;
    }
  },

  watch: {
  },

  mounted() {
    this.loadData();
  },

  methods: {
    loadData() {

      // TODO: Move to Store
      this.userId = this.$route.params.id;
      this.$store.commit('LOAD_START');

      users.getUserProfile(this.userId)
        .then((data) => {
          this.userProfileData = data;
          this.$store.commit('LOAD_FINISH');
          this.$emit('updateHead');
          this.dataLoaded = true;
        },
        (error) => {
          this.$store.commit('LOAD_FINISH');
          this.$router.push('/');
          this.$store.dispatch('handleError', 'User nicht gefunden');
        });
    },
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.v-user {
  padding-top: 5rem;
  padding-bottom: 4rem;

  @include tablet() {
    padding-top: 8rem;
  }

  &::before, &::after {
    content: "";
    display: block;
    width: 100%;
    height: 30rem;
    position: absolute;
    top: 0;
    left: 0;
  }
  &::before {
    z-index: -1;
    background-image: linear-gradient(0deg, #FFFFFF 2%, rgba(255,255,255,0.00) 74%);
  }
  &::after {
    z-index: -2;
    background-image: linear-gradient(-137deg, #FCFFD6 0%, #E2FDFF 100%);
  }

  &__avatar {
    border: 1px solid #eee;
    width: 6rem;
    height: 6rem;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 6px;
    margin-bottom: -1rem;
    overflow: hidden;

    img {
      max-width: 100%;
      max-height: 100%;
      height: auto;
      width: auto;
    }

    @include tablet {
      width: 10rem;
      height: 10rem;
    }
  }

  &__bio {
    max-width: 30rem;
    margin: -2rem auto 2rem auto;
    text-align: center;
  }

  &__spots {
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    @include tablet() {
      margin-top: 0;
    }

    &__item {
      width: 100%;

      @include tablet {
        width: calc(50% - 1rem);
      }
      // @include desktop {
      //   width: calc(33.3% - 1.33rem);
      // }
    }
  }
}



</style>
