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
        <button type="submit" class="btn">OK</button>
        <div class="notice" v-if="message != ''">{{ message }}</div>
        <router-link to="/forgottenpw" class="forgotten-link">Passwort vergessen?</router-link>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'login-view',
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
  padding: 2rem 0;
  min-height: calc(100vh - 600px);

  @include desktop() {
    padding: 2rem 0;
  }

  h1 {
    margin-bottom: 2rem;
  }

  .forgotten-link {
    font-size: .9rem;
    display: block;
    margin-top: 2rem;
  }
}



</style>
