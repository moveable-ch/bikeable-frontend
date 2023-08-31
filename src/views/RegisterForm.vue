<!-- /register -->

<template>
  <div class="register">
    <div class="container container--narrow">
      <h1>{{ $t('register.register') }}</h1>
      <form @submit.prevent="register">
        <label>
          <span>{{ $t('register.username') }}</span>
          <input type="text" v-model="formUsername">
        </label>
        <label>
          <span>{{ $t('register.email') }}</span>
          <input type="email" v-model="formEmail">
        </label>
        <label>
          <span>{{ $t('register.password') }}</span>
          <input type="password" v-model="formPassword">
        </label>
        <p>
          <router-link target="_blank" to="/privacypolicy" class="link-more">{{
          $t("privacypolicy.title")
        }}</router-link>
        </p>
        <p>
        <router-link target="_blank" to="/termsconditions" class="link-more">{{
          $t("termsandconditions.title")
        }}</router-link>
        </p>
        <button type="submit" class="btn">{{ $t('register.send') }}</button>
        <div class="notice" v-if="message != ''">{{ message }}</div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'v-register',
  data () {
    return {
      message: '',

      formUsername: '',
      formEmail: '',
      formPassword: ''
    }
  },

  computed: {

  },

  watch: {

  },

  mounted() {

  },

  methods: {
    register() {
      this.$store.dispatch('register', {
          email: this.formEmail,
          username: this.formUsername,
          password: this.formPassword
        })
      .then((data) => {
          this.$router.push('/');
          this.$store.dispatch('handleError', $t('register.sucessfullregistered'));
        }, (data) => {
          // this.message = data.body.message;
        });
    }
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.register {
  padding: 4rem 0 2rem 0;
  min-height: calc(100vh - 600px);

  &::before, &::after {
    content: "";
    display: block;
    width: 100%;
    height: 40rem;
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

  @include tablet() {
    padding: 6rem 0;
  }

  h1 {
    margin-bottom: 2rem;
  }
}



</style>
