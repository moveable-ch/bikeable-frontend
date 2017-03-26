<template>
  <div class="password-retrieval">
    <h1>Passwort vergessen</h1>
    <form @submit.prevent="submitForm">
      <input type="email" placeholder="E-Mail" v-model="formEmail">
      <button type="submit" class="btn">OK</button>
      <div class="notice" v-if="message != ''">{{ message }}</div>
    </form>
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

      this.$store.dispatch('forgottenpw', {
          email: this.formEmail
        })
      .then((data) => {
          console.log(data);
          // this.$router.push('/login');
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

.password-retrieval {
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
