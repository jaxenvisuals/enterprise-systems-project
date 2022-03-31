<template>
  <div
    class="
      fixed
      top-0
      left-0
      z-10
      flex flex-wrap
      justify-center
      w-full
      py-6
      backdrop-blur-md
    "
    :class="[{ 'bg-white/40': !advanced, 'bg-white/70': advanced }]"
  >
    <div class="flex justify-between w-4/5">
      <div class="w-1/2 flex items-center">
        <AppButton url="/home" :button="false" title="Home" class="mr-2" />
        <IconicInput
          v-model.trim="query.search"
          placeholder="Find a restaurant"
          @enter="search"
        />
        <AppButton title="Search" dark class="mx-3" @click="search" />

        <div
          class="
            underline
            hover:no-underline
            text-sm
            cursor-pointer
            flex-shrink-0
          "
          @click.prevent="toggleAdvanced"
        >
          {{ advanced ? 'Hide advanced search' : 'Advanced search' }}
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <template v-if="!user.loggedIn">
          <AppButton
            url="/auth?type=create"
            :button="false"
            title="Create Account"
            class=""
          />

          <AppButton
            url="/auth?type=login"
            :button="false"
            title="Login"
            class=""
          />
        </template>

        <template v-else>
          <AppButton
            v-if="user.admin"
            url="/admin/manage-restaurants"
            :button="false"
            title="Manage Restaurants"
            class=""
          />
          <AppButton
            :title="`Logout: ${user.name.first}`"
            class=""
            @click="logout"
          />
        </template>
      </div>
    </div>
    <div v-if="advanced" class="w-4/5 mt-2 grid grid-cols-12 gap-2">
      <div class="col-span-2">
        <SelectMenu
          v-model="query.cuisine"
          :options="cuisines"
          label="Type of Food"
          label-key="name"
          value-key="name"
          @input="search"
        />
      </div>
      <div class="col-span-2">
        <SelectMenu
          v-model="query.occasion"
          :options="occasions"
          label="Type of Occasion"
          label-key="name"
          value-key="name"
          @input="search"
        />
      </div>
      <div class="col-span-2">
        <AppInput
          v-model.number="query.minCost"
          label="Minimum Cost (£)"
          placeholder="Min. cost"
          input-type="number"
          @enter="search"
        />
      </div>
      <div class="col-span-2">
        <AppInput
          v-model.number="query.maxCost"
          label="Maximum Cost (£)"
          placeholder="Max. Cost"
          input-type="number"
          @enter="search"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar',

  data() {
    return {
      advanced: false,
      query: {
        search: '',
        cuisine: '',
        occasion: '',
        minCost: null,
        maxCost: null,
      },
    }
  },

  computed: {
    user() {
      return this.$store.state.user
    },

    cuisines() {
      return this.$store.state.restaurantTemplate.typeOfFood.fields
    },

    occasions() {
      return this.$store.state.restaurantTemplate.typeOfOccassion.fields
    },
  },

  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced
    },

    async search() {
      const query = []
      let i = 0
      let str = '?'

      if (this.query.search)
        query.push({ name: 'search', value: this.query.search })
      if (this.query.cuisine)
        query.push({ name: 'cuisine', value: this.query.cuisine })
      if (this.query.occasion)
        query.push({ name: 'occasion', value: this.query.occasion })
      if (this.query.minCost > 0)
        query.push({ name: 'minCost', value: this.query.minCost })
      if (this.query.maxCost > 0)
        query.push({ name: 'maxCost', value: this.query.maxCost })

      if (query.length) {
        query.forEach((q) => {
          i++
          str += `${q.name}=${q.value}${i === query.length ? '' : '&'}`
        })
      }

      this.$store.commit('setSearch', true)

      const redirect = '/search' + str
      if (
        this.$route.path !== redirect &&
        this.$route.path !== '/admin/manage-restaurants'
      )
        this.$router.push(redirect)

      const restaurants = await this.$store.dispatch('getRestaurants', {
        query: `${str}`,
      })

      if (restaurants) {
        this.$store.commit('setSearch', false)

        return restaurants
      } else {
        this.$store.commit('setSearch', false)
      }
    },

    logout() {
      this.$store.commit('clearUser')
      localStorage.removeItem('user')
    },
  },
}
</script>
