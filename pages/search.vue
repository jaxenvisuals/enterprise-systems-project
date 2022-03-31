<template>
  <div class="flex flex-col items-center w-full mt-[94px]">
    <div v-if="searching" class="mb-6 mt-[130px] text-center font-bold text-sm">
      {{ loadingText }}
    </div>
    <div v-if="restaurants.length && !searching" class="w-4/5 mt-6">
      <div class="">
        <div class="text-xl">{{ restaurants.length }} Search Results</div>
      </div>

      <div class="grid grid-cols-5 gap-12 mt-4">
        <nuxt-link
          v-for="(restaurant, i) in restaurants"
          :key="i"
          :to="'/restaurant/' + restaurant._id"
          class="block hover:opacity-70"
        >
          <div class="bg-[#c4c4c4] h-44 rounded-lg relative overflow-hidden">
            <img
              class="absolute object-cover w-full h-full"
              :src="'https://images.pexels.com/photos/1267315/pexels-photo-1267315.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'"
            />
          </div>

          <div class="mt-3 text-black">
            <div
              class="
                inline-flex
                px-2
                py-px
                text-xs text-black
                rounded-sm
                bg-app-gray-100
              "
            >
              <span class="inline-block mr-1">
                <MaterialIcon icon="emoji_events" class="text-xs" />
              </span>

              <span class="font-bold"> TOP #{{ i + 1 }} </span>
            </div>
            <div class="mt-px">
              <p class="text-lg font-medium leading-snug">
                {{ restaurant.name }}
              </p>
              <div class="mt-px text-xs">
                <div class="">
                  <StarRating
                    :count="
                      restaurant.reviews ? restaurant.reviews.length : false
                    "
                    :values="overall(restaurant).rating"
                  />
                </div>
              </div>
              <div class="mt-px text-xs">
                <div class="">
                  £{{ restaurant.cost.min }} - £{{ restaurant.cost.max }}
                </div>
              </div>
            </div>

            <div class="flex items-center mt-px text-black">
              <span class="inline-block mr-1">
                <MaterialIcon icon="place" class="text-xs" />
              </span>

              <span class="inline-block text-xs">{{
                restaurant.location
              }}</span>
            </div>

            <div class="mt-px">
              <StarRating :values="[]" />
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
    <div
      v-else-if="!searching"
      class="mb-6 mt-[130px] text-center font-bold text-sm"
    >
      No search result
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchResults',

  data() {
    return {
      loadingText: 'Loading...',
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
    searching() {
      return this.$store.state.searching
    },

    restaurants() {
      return this.$store.state.restaurants
    },

    overall() {
      return (restaurant) => {
        let overall = {}
        restaurant.ratings.forEach((rating) => {
          if (rating.name === 'Overall Delivery') overall = rating
        })

        return overall
      }
    },
  },

  watch: {
    searching() {
      this.watchLoader()
    },
  },

  mounted() {
    this.$store.commit('setSearch', true)

    this.watchLoader()
    this.search()
  },

  methods: {
    watchLoader() {
      this.query.search = this.$route.query.search || ''
      this.query.cuisine = this.$route.query.cuisine || ''
      this.query.occasion = this.$route.query.occasion || ''
      this.query.minCost = this.$route.query.minCost || null
      this.query.maxCost = this.$route.query.maxCost || null

      setTimeout(() => {
        if (this.searching) {
          this.loadingText = 'Loading... Almost there...'
        } else {
          this.loadingText = 'Loading...'
        }
      }, 3500)
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
  },
}
</script>
