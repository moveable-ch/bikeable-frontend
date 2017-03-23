<template>
  <div class="login">
    <h1>Login</h1>
    <input type="email" placeholder="E-Mail">
    <input type="password" placeholder="Passwort">
    <button class="btn disabled" disabled>OK</button>
  </div>
</template>

<script>
export default {
  name: 'login-view',
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

  }
}
</script>

<style lang="scss" scoped>

@import '../styles/helpers';

.login {
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
