<template>
  <div>
    <div v-if="!loaded" class="mt-[150px] text-center font-bold text-sm">
      {{ loadingText }}
    </div>
    <div v-else>
      <div class="mt-[110px] relative w-4/5 mx-auto">
        <div class="flex">
          <div
            class="
              featured-image
              relative
              flex-shrink-0
              rounded-xl
              overflow-hidden
              bg-[#c4c4c4]
            "
          >
            <img
              class="absolute object-cover w-full h-full"
              :src="'https://images.pexels.com/photos/541216/pexels-photo-541216.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'"
            />
          </div>

          <div class="pl-5">
            <div class="">
              <p class="text-3xl font-bold leading-snug text-black">
                {{ restaurant.name }}
              </p>
              <div class="mt-1">
                <div class="flex items-center text-black">
                  <span class="inline-block mr-1">
                    <MaterialIcon icon="place" class="text-xl" />
                  </span>

                  <span class="inline-block text-xs">{{
                    restaurant.location
                  }}</span>
                </div>
                <div class="mt-px flex items-center">
                  <StarRating
                    class="mr-2"
                    :count="
                      restaurant.reviews ? restaurant.reviews.length : false
                    "
                    size="xl"
                    :values="overall.rating"
                  />
                  <div class="text-sm">
                    £{{ restaurant.cost.min }} - £{{ restaurant.cost.max }}
                  </div>
                </div>
              </div>
              <p class="pt-2 text-sm leading-snug text-black">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Excepturi magnam ex aliquid eius eaque natus non corrupti
                possimus reiciendis sed doloribus provident tempora dolore
                voluptatibus, ea repudiandae expedita pariatur cupiditate. Lorem
                ipsum dolor, sit amet consectetur adipisicing elit. Excepturi
                magnam ex aliquid eius eaque natus non corrupti possimus
                reiciendis sed doloribus provident tempora dolore voluptatibus,
                ea repudiandae expedita pariatur cupiditate.<br />
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Excepturi magnam ex aliquid eius eaque natus non corrupti
                possimus reiciendis sed doloribus provident tempora dolore
                voluptatibus, ea repudiandae expedita pariatur cupiditate.
              </p>
            </div>

            <div class="mt-4">
              <p class="text-lg font-bold">Ratings</p>

              <div class="flex flex-col gap-1 mt-2 w-3/4">
                <div
                  v-for="(rating, i) in restaurant.ratings"
                  :key="i"
                  class="flex justify-between items-center"
                >
                  <p class="flex-grow text-xs leading-snug">
                    {{ rating.name }}
                  </p>
                  <StarRating :count="false" :values="rating.rating" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!user.admin" class="mt-10">
          <div class="flex">
            <div class="text-black flex-grow">
              <p class="text-lg font-bold">Add your review</p>
              <div v-if="!user.loggedIn" class="mt-1 text-sm">
                To add a review, you need to have an existing account. Don't
                have one?
                <nuxt-link
                  :to="`/auth?type=create&redirect=${$route.path}`"
                  class="font-bold underline text-blue-600 hover:no-underline"
                  >Create an account</nuxt-link
                >
              </div>
              <div v-else class="mt-1 text-sm">
                Have you tried
                <span class="font-bold">{{ restaurant.name }}</span> yet? Add
                your review to help other find the perfect restaurant.
              </div>
            </div>

            <div class="">
              <AppButton
                v-if="!user.loggedIn"
                :url="`/auth?type=login&redirect=${$route.path}`"
                :button="false"
                title="Login to add review"
                class=""
              />
              <AppButton
                v-else
                title="Add your review"
                class=""
                @click="showModal(true)"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="restaurant.reviews.length"
        class="relative w-4/5 mt-10 mx-auto mb-20"
      >
        <div class="">
          <div class="text-xl">{{ restaurant.reviews.length }} Reviews</div>
        </div>

        <div class="flex flex-col gap-3 mt-6">
          <AReviewCard
            v-for="(review, i) in restaurant.reviews"
            :key="i"
            :review="review"
            :deletable="review.userID === user._id"
            @edit="editReview(review)"
            @delete="deleteReview(review)"
          />
        </div>
      </div>

      <div v-else class="my-6 text-center font-bold text-sm">
        No review has been added
      </div>
    </div>

    <AddReview
      v-if="modalVisible"
      :restaurant="restaurant"
      :new="isNew"
      :review="toEdit"
      @close="hideModal($event)"
    />
  </div>
</template>

<script>
export default {
  name: 'ARestaurantPage',

  data() {
    return {
      loadingText: 'Loading...',
      loaded: false,
      restaurant: {},
      modalVisible: false,
      toEdit: {},
      isNew: true,
    }
  },

  computed: {
    user() {
      return this.$store.state.user
    },

    id() {
      return this.$route.params.restaurant
    },

    overall() {
      let overall = {}
      if (this.restaurant._id) {
        this.restaurant.ratings.forEach((rating) => {
          if (rating.name === 'Overall Delivery') overall = rating
        })
      }

      return overall
    },
  },

  mounted() {
    setTimeout(() => {
      if (!this.loaded) {
        this.loadingText = 'Loading... Almost there...'
      }
    }, 3500)

    this.getRestaurant()
  },

  methods: {
    async getRestaurant() {
      this.loadingText = 'Loading'
      this.loaded = false
      const restaurant = await this.$store.dispatch('getRestaurant', {
        id: this.id,
      })

      if (restaurant._id) {
        this.restaurant = restaurant
        this.loaded = true
      }
    },

    showModal(isNew) {
      if (isNew) {
        this.isNew = true
      } else {
        this.isNew = false
      }

      this.modalVisible = true
    },

    hideModal(e) {
      this.modalVisible = false
      this.toEdit = {}
      if (e) this.getRestaurant()
    },

    editReview({
      expenseRating,
      foodRating,
      ambianceRating,
      serviceRating,
      cleanlinessRating,
      speedRating,
      valueRating,
      allergyRating,
      overallRating,
      comment,
      cuisine,
      service,
      occasion,
      meals,
      id,
    }) {
      this.toEdit = {
        id,
        expenseRating,
        foodRating,
        ambianceRating,
        serviceRating,
        cleanlinessRating,
        speedRating,
        valueRating,
        allergyRating,
        overallRating,
        comment,
        service,
        cuisine,
        occasion,
        meals,
      }

      this.showModal(false)
    },

    deleteReview(review) {
      console.log(review)
      // this.$axios({
      //   method: 'DELETE',
      //   url: 'api/review/' + review.id,
      // })
      //   .then(({ data }) => {
      //     this.getRestaurant()
      //     return data
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //     return Promise.reject(new Error(err))
      //   })
      //   .finally(() => {})
    },
  },
}
</script>

<style lang="postcss" scoped>
.featured-image {
  width: calc(100vh - 130px);
  padding-bottom: calc(100vh - 130px);
}
</style>
