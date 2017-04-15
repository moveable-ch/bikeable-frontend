<template>
  <div class="password-retrieval">
    <div class="container">
      <h1>passwort vergessen</h1>
      <form @submit.prevent="submitForm">
        <input type="email" placeholder="E-Mail" v-model="formEmail">
        <button type="submit" class="btn">OK</button>
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
  margin: 2rem 0;

  @include desktop() {
  }
}

h1 {
  margin-bottom: 2rem;
}


</style>
