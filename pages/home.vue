<template>
  <div>
    <div v-if="!loaded" class="mt-[250px] text-center font-bold text-sm">
      {{ loadingText }}
    </div>
    <div v-else>
      <div class="bg-[#c4c4c4] flex justify-center mt-[94px] relative">
        <img
          class="absolute object-cover w-full h-full"
          :src="'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'"
        />

        <div
          class="absolute top-0 left-0 w-full h-full bg-black opacity-40"
        ></div>

        <div
          class="
            py-28
            relative
            flex flex-col
            items-center
            justify-center
            w-4/5
            text-white
          "
        >
          <div class="text-center">
            <p class="text-4xl">We Direct you to the</p>
            <p class="mt-2 font-bold text-8xl">Right Restaurant</p>
          </div>

          <div class="w-3/5 mt-6 text-center">
            <p class="text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Reprehenderit exercitationem molestias unde nisi tempore laborum
              sint veniam in aperiam. Tenetur pariatur quos eveniet praesentium,
              assumenda libero officia et facilis cupiditate.
            </p>

            <div v-if="!user.loggedIn" class="flex justify-center gap-3 mt-6">
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
            </div>
          </div>
        </div>
      </div>

      <div class="relative w-4/5 mx-auto top-[-90px]">
        <div class="">
          <div class="text-xl text-white">Browse Restaurants</div>
        </div>

        <div class="flex flex-col gap-3 mt-6">
          <ARestaurantCard
            v-for="(restaurant, i) in restaurants"
            :key="i"
            :restaurant="restaurant"
            :editable="false"
            :deletetable="false"
            position
            :position-number="i + 1"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',

  data() {
    return {
      loaded: false,
      loadingText: 'Loading...',
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
      if (this.loading) {
        this.loadingText = 'Loading... Almost there...'
      }
    }, 3500)

    this.getRestaurants()
  },

  methods: {
    async getRestaurants() {
      this.loadingText = 'Loading'
      this.loading = true

      const restaurants = await this.$store.dispatch('getRestaurants', {})
      if (restaurants) {
        this.loaded = true
      }
    },
  },
}
</script>
