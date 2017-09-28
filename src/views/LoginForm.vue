<!-- /login -->

<template>
  <div class="login">
    <div class="container">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <label>
          <span>E-Mail</span>
          <input type="email" v-model="formEmail">
        </label>
        <label>
          <span>Passwort</span>
          <input type="password" v-model="formPassword">
        </label>
        <button type="submit" class="btn">Login</button>
        <div class="notice" v-if="message != ''">{{ message }}</div>
        <router-link to="/forgottenpw" class="link-more">Passwort vergessen?</router-link>
        <router-link to="/register" class="link-more">Neuen Account erstellen</router-link>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'v-login',
  data () {
    return {
      message: '',

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
    login() {
      this.$store.dispatch('login', {
          email: this.formEmail,
          password: this.formPassword
        })
      .then((data) => {
          this.$router.push('/');
        }, (data) => {
        });
    }
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.login {
  padding: 0 0 2rem 0;
  min-height: calc(100vh - 600px);

  @include desktop() {
    padding: 2rem 0;
  }

  h1 {
    margin-bottom: 2rem;
  }

  .btn {
    margin-bottom: 2rem;
  }

  .link-more {
    font-size: .9rem;
    display: block;
    margin-top: .5rem;
  }
}



</style>
