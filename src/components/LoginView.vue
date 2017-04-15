<template>
  <div class="login">
    <div class="container">
      <h1>login</h1>
      <form @submit.prevent="login">
        <input type="email" placeholder="E-Mail" v-model="formEmail">
        <input type="password" placeholder="Passwort" v-model="formPassword">
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
          // console.log('success', data);
          this.$router.push('/');
        }, (data) => {
          console.log('error', data);
          // this.message = data.body.message;
        });
    }
  }
}
</script>

<style lang="scss" scoped>

@import '../styles/helpers';

.login {
  margin: 2rem 0;

  @include desktop() {
    padding: 0 2rem;
  }
}

h1 {
  margin-bottom: 2rem;
}

.forgotten-link {
  font-size: .9rem;
  display: block;
  margin-top: 2rem;
}


</style>
