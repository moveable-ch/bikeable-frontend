<template>
  <div class="password-retrieval">
    <div class="container">
      <h1>Passwort vergessen</h1>
      <form @submit.prevent="submitForm">
        <input class="input-text" type="email" placeholder="E-Mail" v-model="formEmail">
        <button class="input-button btn" type="submit">OK</button>
        <div class="notice" v-if="message != ''">{{ message }}</div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'password-retrieval-view',
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
    submitForm() {
      if(this.formEmail == '') return;

      this.$store.dispatch('forgottenPassword', {
          email: this.formEmail
        })
      .then((data) => {
          this.$router.push('/login');
          this.$store.dispatch('handleError', data.message);
        });
    }
  }
}
</script>

<style lang="scss" scoped>

@import '../styles/helpers';

.password-retrieval {
  padding: 2rem 0;
  min-height: calc(100vh - 600px);

  .input-text {
    width: 100%;
  }
  .input-button {
    display: block;
    width: 10rem;
    margin: 1rem auto;
  }

  @include desktop() {
    padding: 3rem 0;

    .input-text {
      // width: 100%;
    }
    .input-button {
      margin: 2rem 0;
      // display: inline-block;
      // width: calc(20% - 2rem);
    }
  }
}

h1 {
  margin-bottom: 2rem;
}


</style>
