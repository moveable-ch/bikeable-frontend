<!-- /login -->

<template>
  <div class="login">
    <div class="container container--narrow">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <label>
          <span>E-Mail</span>
          <input type="email" v-model="formEmail">
        </label>
        <label>
          <span>{{ $t('register.password') }}</span>
          <input type="password" v-model="formPassword">
        </label>
        <button type="submit" class="btn">Login</button>
        <div class="notice" v-if="message != ''">{{ message }}</div>
        <router-link to="/forgottenpw" class="link-more">{{ $t('login.forgotpassword') }}</router-link>
        <router-link to="/register" class="link-more">{{ $t('login.newaccount') }}</router-link>
      </form>
<!--       <form @submit.prevent="loginAtFacebook">
        <button type="submit" class="btn btn--facebook">{{ $t('login.forgotpassword') }}Login with Facebook</button>
      </form> -->
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
      FB: undefined,
      fromPath: '/'
    }
  },

  computed: {

  },

  watch: {

  },

  mounted() {
    // this.initFbLogin();
  },

  beforeRouteEnter(to, from, next) {
    console.log(this);
    // this.fromPath = from.path;
    next(vm => {
      vm.fromPath = from.path;
    });
  },

  methods: {
    login() {
      this.$store.dispatch('login', {
          email: this.formEmail,
          password: this.formPassword
        })
      .then((data) => {
          this.$router.push(this.fromPath);
        }, (data) => {
        });
    },
    initFbLogin() {
      window.fbAsyncInit = function() {
        FB.init({
          appId      : '312310255868775',
          xfbml      : true,
          version    : 'v2.7'
        });

        self.FB = FB;

        //This function should be here, inside window.fbAsyncInit
        FB.getLoginStatus(function(response) {

          if (response.status === 'connected') {
            // the user is logged in and has authenticated your
            // app, and response.authResponse supplies
            // the user's ID, a valid access token, a signed
            // request, and the time the access token
            // and signed request each expire
            self.onFbLogin(response)

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
    loginAtFacebook() {
      var loginForm = this;
      this.FB.login(function(response) {
        if (response.status === 'connected') {
          // the user is logged in and has authenticated your
          // app, and response.authResponse supplies
          // the user's ID, a valid access token, a signed
          // request, and the time the access token
          // and signed request each expire
          loginForm.onFbLogin(response)

        } else if (response.status === 'not_authorized') {
          // the user must go through the login flow
          // to authorize your app or renew authorization

        } else {
          // the user isn't logged in to Facebook.
        }
      }, {scope: 'email'});

    },
    fbLogin() {
      this.$store.dispatch('fblogin', {
          accessToken: this.fbAccessToken,
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
          this.fbLogin()
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

  @include tablet() {
    padding: 6rem 0;
  }

  h1 {
    margin-bottom: 2rem;
  }

  .btn {
    margin-bottom: 2rem;
  }

  .btn--facebook {
    padding-left: 60px;
    background: $c-black url('../assets/login-fb-logo.png') no-repeat left center;
    background-size: contain;
    color: #fff;
    border: 2px solid $c-black;

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
