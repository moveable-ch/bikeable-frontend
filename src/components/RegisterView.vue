<template>
  <div class="register">
    <h1>Registrieren</h1>
    <form @submit.prevent="register">
      <input type="text" placeholder="Username" v-model="formUsername">
      <input type="email" placeholder="E-Mail" v-model="formEmail">
      <input type="password" placeholder="Passwort" v-model="formPassword">
      <button type="submit" class="btn">OK</button>
      <div class="notice" v-if="message != ''">{{ message }}</div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'register-view',
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
          console.log('success', data);
          this.message = data.body.message;
        }, (data) => {
          console.log('error', data);
          this.message = data.body.message;
        });
    }
  }
}
</script>

<style lang="scss" scoped>

@import '../styles/helpers';

.register {
  max-width: 700px;
  margin: 2rem 0;
  padding: 0 1rem;

  @include desktop() {
    padding: 0 2rem;
  }
}

h1 {
  margin-bottom: 2rem;
}


</style>
