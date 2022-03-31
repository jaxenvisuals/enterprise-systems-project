<template>
  <div
    v-if="visible"
    class="mt-[110px] relative w-4/5 mx-auto flex flex-col items-center"
  >
    <div class="grid grid-cols-1 gap-3 w-2/6 mt-10">
      <div class="text-xl font-bold mt-4 text-center">
        {{ login ? 'Login to your account' : 'Create account' }}
      </div>

      <div class="mt-6"></div>

      <div v-if="!login" class="">
        <AppInput
          v-model="form.firstname"
          label="First Name"
          placeholder="John"
        />
      </div>

      <div v-if="!login" class="">
        <AppInput v-model="form.lastname" label="Last Name" placeholder="Doe" />
      </div>

      <div class="">
        <AppInput
          v-model="form.email"
          label="Email Address"
          placeholder="Johndoe@email.com"
          input-type="email"
        />
      </div>

      <div class="">
        <AppInput
          v-model="form.password1"
          label="Password"
          placeholder="Password"
          input-type="password"
        />
      </div>

      <div v-if="!login" class="">
        <AppInput
          v-model="form.password2"
          label="Re-Enter Password"
          placeholder="Re-Enter Password"
          input-type="password"
        />
      </div>

      <div class="">
        <AppButton
          :disabled="loading"
          :title="login ? 'Login' : 'Create Account'"
          dark
          class="w-full"
          @click="processForm"
        />

        <div v-if="loading" class="mt-2 text-center font-bold text-sm">
          Loading...
        </div>
        <div
          v-if="errorMessage && !loading"
          class="mt-2 text-center text-red-500 font-bold text-sm"
        >
          {{ errorMessage }}
        </div>
      </div>

      <div class="mt-4">
        <AppButton
          :disabled="loading"
          :button="false"
          :url="login ? '/auth?type=create' : '/auth?type=login'"
          :title="!login ? 'Login' : 'Create Account'"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthPage',

  data() {
    return {
      visible: false,
      login: true,
      form: {},
      loading: false,
      errorMessage: null,
    }
  },

  computed: {
    query() {
      return this.$route.query.type
    },
    redirect() {
      return this.$route.query.redirect || '/home'
    },
  },

  watch: {
    query() {
      this.updateFormState()
    },
  },

  mounted() {
    if (this.$store.state.user.loggedIn) {
      this.$router.push('/home')
    } else {
      this.updateFormState()
    }
  },

  methods: {
    checkEmail(e) {
      return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(
        e
      )
    },

    updateFormState() {
      if (this.query === 'create') {
        this.login = false
      } else {
        this.login = true
      }
      this.form = {}
      this.visible = true
    },

    processForm() {
      if (this.login) {
        this.processLogin()
        return
      }
      this.processCreate()
    },

    processLogin() {
      if (!this.form.email || !this.form.password1) {
        alert('Email and password required')
        return
      }

      if (!this.checkEmail(this.form.email)) {
        alert('Invalid Email Address')
        return
      }

      this.loginUser()
    },

    processCreate() {
      if (
        !this.form.firstname ||
        !this.form.lastname ||
        !this.form.email ||
        !this.form.password1 ||
        !this.form.password2
      ) {
        alert('All fields required')
        return
      }

      if (!this.checkEmail(this.form.email)) {
        alert('Invalid Email Address')
        return
      }

      if (this.form.password1 !== this.form.password2) {
        alert('Passwords do not match')
        return
      }

      this.createUser()
    },

    loginUser() {
      this.errorMessage = null
      this.loading = true
      this.$axios({
        method: 'POST',
        url: 'api/user/login',
        data: JSON.stringify({
          email: this.form.email,
          password: this.form.password1,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(({ data }) => {
          this.errorMessage = null
          if (data._id) {
            const user = {
              ...data,
              admin: data.email === 'admin@sep.com',
            }
            this.$store.commit('setUser', {
              loggedIn: true,
              ...user,
            })
            localStorage.setItem('user', JSON.stringify(user))
            this.$router.push(this.redirect)
          } else {
            this.errorMessage =
              'We are sorry! Email and/or password is incorrect'
          }
        })
        .catch((err) => {
          this.errorMessage = 'We are sorry! Email and/or password is incorrect'
          console.log(err)
          return Promise.reject(new Error(err))
        })
        .finally(() => {
          this.loading = false
        })
    },

    createUser() {
      this.errorMessage = null
      this.loading = true
      this.$axios({
        method: 'POST',
        url: 'api/user/',
        data: JSON.stringify(this.form),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(({ data }) => {
          this.errorMessage = null
          this.$router.push('/auth?type=login&redirect=' + this.redirect)
        })
        .catch((err) => {
          this.errorMessage = 'We are sorry! We could not process your request'
          console.log(err)
          return Promise.reject(new Error(err))
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
