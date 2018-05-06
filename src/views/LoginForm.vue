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
      <form @submit.prevent="loginAtFacebook">
        <button type="submit" id="facebook-button" class="btn">Login with facebook</button>
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
      formPassword: '',
      fbIsConnected: false,
      fbName: '',
      fbEmail: '',
      fbUserId: '',
      fbAccessToken: '',
      FB: undefined
    }
  },

  computed: {

  },

  watch: {

  },

  mounted() {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '312310255868775',
        xfbml      : true,
        version    : 'v2.7'
      });

      this.FB = FB;

      //This function should be here, inside window.fbAsyncInit
      FB.getLoginStatus(function(response) {

        if (response.status === 'connected') {
          // the user is logged in and has authenticated your
          // app, and response.authResponse supplies
          // the user's ID, a valid access token, a signed
          // request, and the time the access token 
          // and signed request each expire
          onFbLogin(response)

        } else if (response.status === 'not_authorized') {
          // the user must go through the login flow
          // to authorize your app or renew authorization

        } else {
          // the user isn't logged in to Facebook.
        }

        console.log(response);
     });

   };

    (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
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
    },
    loginAtFacebook() {

      FB.login(function(response) {
        if (response.status === 'connected') {
          // the user is logged in and has authenticated your
          // app, and response.authResponse supplies
          // the user's ID, a valid access token, a signed
          // request, and the time the access token 
          // and signed request each expire
          onFbLogin(response)

        } else if (response.status === 'not_authorized') {
          // the user must go through the login flow
          // to authorize your app or renew authorization

        } else {
          // the user isn't logged in to Facebook.
        }
      });

    },
    fbLogin() {
      this.$store.dispatch('fblogin', {
          accessToken: fbAccessToken,
          email: this.fbemail,
          name: this.fbname
        })
      .then((data) => {
          this.$router.push('/');
        }, (data) => {
        });
    },
    onFbLogin(response) {
      this.fbUserId = response.authResponse.userID;
      this.fbAccessToken = response.authResponse.accessToken;
      this.fbIsConnected = true
      this.FB.api('/me', 'GET', { fields: 'name, email' },
        userInformation => {
          this.fbemail = userInformation.email;
          this.fbname = userInformation.name;
          fblogin()
        }
      )
    },
    onFbLogout() {
      this.fbIsConnected = false;
    }
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.login {
  padding: 0 0 2rem 0;
  min-height: calc(100vh - 600px);

  @include tablet() {
    padding: 2rem 0;
  }

  h1 {
    margin-bottom: 2rem;
  }

  .btn {
    margin-bottom: 2rem;
  }

  #facebook-button {

    padding-left: 60px;

    background: $c-black url('../assets/login-fb-logo.png') no-repeat left center;
    background-size: contain;

    &:disabled,
    &[disabled] {
      cursor: default;
      background-color: lighten($c-black, 60%);
      border-color: lighten($c-black, 60%);
    }

  }


  .link-more {
    font-size: .9rem;
    display: block;
    margin-top: .5rem;
  }
}



</style>
