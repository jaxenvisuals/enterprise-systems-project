<template>
  <div
    class="
      py-8
      overflow-auto
      fixed
      z-10
      top-0
      left-0
      right-0
      bottom-0
      bg-white/70
      backdrop-blur-lg
    "
  >
    <div class="w-3/5 mx-auto">
      <div class="flex gap-6">
        <div class="flex-grow">
          <p class="text-xl font-bold">Add your review for</p>
          <div class="mt-2">
            <div
              class="
                rounded-full
                inline-flex
                pl-4
                pr-8
                pt-2
                pb-2
                border
                items-center
                shadow
                bg-white/60
              "
            >
              <div class="">
                <div
                  class="w-12 h-12 flex-shrink-0 rounded-full bg-[#c4c4c4]"
                ></div>
              </div>

              <div class="pl-4">
                <p class="text-sm font-bold leading-snug">
                  {{ restaurant.name }}
                </p>
                <div class="flex items-center text-black">
                  <span class="inline-block mr-1">
                    <MaterialIcon icon="place" class="text-xs" />
                  </span>

                  <span class="inline-block text-xs">{{
                    restaurant.location
                  }}</span>
                </div>
                <div class="mt-px">
                  <StarRating
                    :count="false"
                    size="sm"
                    :values="overall.rating"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="">
          <AppButton title="Cancel" class="" @click="hideModal" />
        </div>
      </div>

      <div class="mt-6">
        <div class="flex flex-col gap-2">
          <AddRestaurantCard
            v-for="template in restaurantTemplate"
            :key="template.name"
            :template="template"
            :form="form"
            :restaurant="restaurant"
            for-review
            @input="updateForm(template.key, $event)"
          />

          <div class="">
            <AStarReviewCard
              v-model="others"
              :is-new="isNew"
              :template="otherRatings"
              placeholder=""
              :review="review"
            />
          </div>

          <div class="">
            <AStarReviewCard
              v-model="overallRating"
              :is-new="isNew"
              :template="overallTemplate"
              placeholder=""
              :review="review"
            />
          </div>

          <AStarReviewCard
            v-model="comments"
            :is-new="isNew"
            type="textarea"
            :template="{
              name: 'Do you have any other comments?',
              description:
                'Type in any special comment about your experience below',
            }"
            placeholder="Type your comments here"
            :review="review"
          />
        </div>

        <div class="flex-col flex mt-4">
          <AppButton
            :title="isNew ? 'Submit Review' : 'Update Review'"
            dark
            class="mb-3"
            :disabled="loading"
            @click="processForm"
          />

          <div v-if="loading" class="my-2 text-center font-bold text-sm">
            Loading...
          </div>

          <div
            v-if="errorMessage && !loading"
            class="my-2 text-center text-red-500 font-bold text-sm"
          >
            {{ errorMessage }}
          </div>

          <AppButton :title="'Cancel'" @click="hideModal" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddReview',

  props: {
    restaurant: {
      type: Object,
      required: true,
    },

    review: {
      type: Object,
      required: true,
    },

    new: {
      type: Boolean,
      default: true,
    },
  },

  data: () => {
    return {
      loading: false,
      errorMessage: null,
      form: {},
      others: {},
      comments: '',
      otherRatings: {
        name: 'Rate your some other options',
        description:
          'Rate each of these options to help others find the best restaurant',
        fields: [
          {
            name: 'Expense',
            key: 'expenseRating',
          },
          {
            name: 'How was the Food?',
            key: 'foodRating',
          },
          {
            name: 'The Ambiance',
            key: 'ambianceRating',
          },
          {
            name: 'Service Delivery',
            key: 'serviceRating',
          },
          {
            name: 'Cleanliness',
            key: 'cleanlinessRating',
          },
          {
            name: 'Speed of Service',
            key: 'speedRating',
          },
          {
            name: 'Value for Money',
            key: 'valueRating',
          },
          {
            name: 'Allergy Information Provided',
            key: 'allergyRating',
          },
        ],
      },
      overallTemplate: {
        name: 'Rate your overall experience',
        description: '',
        fields: [
          {
            name: 'Overal Experience',
            key: 'overallRating',
          },
        ],
      },
      overallRating: {},
    }
  },

  computed: {
    user() {
      return this.$store.state.user
    },

    isNew() {
      return this.new
    },

    restaurantTemplate() {
      return this.$store.state.restaurantTemplate
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
    if (this.new) {
      this.form = {}
    } else {
      this.form = {
        cuisine: this.review.cuisine,
        service: this.review.service,
        meals: this.review.meals,
        occasion: this.review.occasion,
      }
    }
  },

  methods: {
    hideModal(e = false) {
      this.$emit('close', e)
    },

    updateForm(key, value) {
      this.form[key] = value
    },

    processForm() {
      if (!this.overallRating.overallRating) {
        alert('Sorry, You have to give an overall rating.')
        return
      }

      const ratings = {
        ...this.others,
        ...this.overallRating,
      }

      for (const key in ratings) {
        if (!ratings[key]) ratings[key] = 0
      }

      const form = {
        restaurantID: this.restaurant._id,
        userID: this.user._id,
        comment: this.comments,
        ...this.form,
        ...ratings,
      }

      this.saveReview(form)
    },

    saveReview(form) {
      this.loading = true
      this.errorMessage = null
      if (!this.new) {
        delete form.userID
        delete form.restaurantID
        delete form.id
      }

      return this.$axios({
        method: 'POST',
        url: this.new ? 'api/review' : 'api/review/' + this.review.id,
        data: JSON.stringify(form),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          console.log(res)
          this.errorMessage = null
          this.hideModal(true)
        })
        .catch((err) => {
          this.errorMessage = 'Sorry! We were unable to complete this request'
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
