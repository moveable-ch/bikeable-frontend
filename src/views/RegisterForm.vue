<!-- /register -->

<template>
  <div class="register">
    <div class="container">
      <h1>Registrieren</h1>
      <form @submit.prevent="register">
        <label>
          <span>Username</span>
          <input type="text" v-model="formUsername">
        </label>
        <label>
          <span>E-Mail</span>
          <input type="email" v-model="formEmail">
        </label>
        <label>
          <span>Passwort</span>
          <input type="password" v-model="formPassword">
        </label>
        <button type="submit" class="btn">Senden</button>
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
          this.$store.dispatch('handleError', 'Erfolgreich registriert, bitte Account bestätigen.');
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
  padding: 0 0 2rem 0;
  min-height: calc(100vh - 600px);

  @include tablet() {
    padding: 2rem 0;
  }

  h1 {
    margin-bottom: 2rem;
  }
}



</style>
