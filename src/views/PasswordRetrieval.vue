<!-- /forgottenpw -->

<template>
  <div class="password-retrieval">
    <div class="container container--narrow">
      <h1>{{ $t('password.forgot') }}</h1>
      <form @submit.prevent="submitForm">
        <input class="input-text" type="email" placeholder="E-Mail" v-model="formEmail">
        <button class="input-button btn" type="submit">{{ $t('password.send') }}</button>
        <div class="notice" v-if="message != ''">{{ message }}</div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'v-password-retrieval',
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

  .input-text {
    width: 100%;
  }
  .input-button {
    display: block;
    margin: 1rem 0;
  }

  @include tablet() {
    padding: 6rem 0;
  }
}

h1 {
  margin-bottom: 2rem;
}


</style>
