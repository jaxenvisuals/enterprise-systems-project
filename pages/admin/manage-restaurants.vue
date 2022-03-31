<template>
  <div>
    <div v-if="!loaded" class="mt-[150px] text-center font-bold text-sm">
      {{ loadingText }}
    </div>
    <div
      v-else-if="user.loggedIn && user.admin"
      class="mt-[110px] relative w-4/5 mx-auto"
    >
      <div class="mb-6 flex items-center">
        <p class="text-3xl mr-4 font-bold leading-snug text-black">
          Manage Restaurants ({{ restaurants.length }})
        </p>
        <AppButton
          title="Add Restaurant"
          dark
          class=""
          @click="showModal(true)"
        />
      </div>

      <div class="mb-6">
        <div v-if="restaurants.length" class="flex flex-col gap-3 mt-6">
          <ARestaurantCard
            v-for="(restaurant, i) in restaurants"
            :key="i"
            :restaurant="restaurant"
            @edit="editRestaurant(restaurant)"
          />
        </div>
      </div>

      <CreateRestaurant
        v-if="visible"
        :new="isNew"
        :restaurant="toEdit"
        @close="hideModal($event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ManageResturant',

  layout: 'admin',

  data() {
    return {
      loadingText: 'Loading...',
      loaded: false,
      isNew: true,
      visible: false,
      toEdit: {},
    }
  },

  computed: {
    user() {
      return this.$store.state.user
    },

    restaurants() {
      return this.$store.state.restaurants || []
    },
  },

  mounted() {
    setTimeout(() => {
      if (!this.loaded) {
        this.loadingText = 'Loading... Almost there...'
      } else {
        this.loadingText = 'Loading...'
      }
    }, 3500)

    this.getRestaurants()
  },

  methods: {
    showModal(isNew) {
      if (isNew) {
        this.isNew = true
      } else {
        this.isNew = false
      }

      this.visible = true
    },

    hideModal(e) {
      this.visible = false
      if (e) {
        this.getRestaurants()
      }
    },

    editRestaurant({
      name,
      location,
      cuisine,
      service,
      occasion,
      meals,
      cost,
      _id,
    }) {
      this.toEdit = {
        _id,
        name,
        location,
        minCost: cost.min,
        maxCost: cost.max,
        service,
        cuisine,
        occasion,
        meals,
      }

      this.showModal(false)
    },

    async getRestaurants() {
      this.loaded = false
      const restaurants = await this.$store.dispatch('getRestaurants', {})
      if (restaurants) {
        this.loaded = true
      }
    },
  },
}
</script>
