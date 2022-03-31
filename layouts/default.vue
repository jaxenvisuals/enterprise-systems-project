<template>
  <div v-if="loaded" class="min-h-screen">
    <Navbar />
    <Nuxt />
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',

  data() {
    return {
      loaded: false,
    }
  },

  mounted() {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user._id) {
      this.$store.commit('setUser', {
        loggedIn: true,
        ...user,
      })
    }

    this.loaded = true
  },
}
</script>
