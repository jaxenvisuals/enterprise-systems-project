<template>
  <div class="overflow-hidden bg-white border rounded-xl">
    <div class="px-5 pt-5 pb-3">
      <div class="flex gap-5">
        <div class="w-3/5">
          <div class="flex">
            <div
              class="
                w-10
                h-10
                relative
                bg-[#c4c4c4]
                overflow-hidden
                rounded-full
              "
            >
              <img
                class="absolute object-cover w-full h-full"
                :src="'https://images.pexels.com/photos/541216/pexels-photo-541216.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'"
              />
            </div>
            <div class="flex-grow pl-2">
              <p class="text-sm font-medium leading-snug">
                {{ review.username }}
                {{ review.userID === user._id ? '(You)' : '' }}
              </p>
              <div class="mt-px">
                <StarRating :values="overall.rating" />
              </div>
            </div>
          </div>

          <div class="mt-3 text-sm">
            <div
              v-for="(option, i) in review.options"
              :key="i"
              class="flex flex-wrap items-center mb-2"
            >
              <div class="flex-shrink-0 pr-4 text-xs font-bold">
                {{ option.name }}:
              </div>
              <div v-for="(val, n) in option.value" :key="n" class="pr-1">
                <div
                  class="
                    border
                    rounded-full
                    flex
                    items-center
                    justify-center
                    px-5
                    py-2
                    text-xs
                    leading-snug
                  "
                >
                  {{ val }}
                </div>
              </div>
            </div>
            <div v-if="review.comment" class="flex mt-2">
              <MaterialIcon
                icon="comment"
                class="text-yellow-600 mr-3 inline-block text-base"
              />
              <p class="text-sm leading-snug">
                {{ review.comment }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex flex-col w-2/5 gap-1">
          <div
            v-for="(rating, i) in review.ratings"
            :key="i"
            class="flex justify-between"
          >
            <p class="flex-grow text-xs leading-snug">{{ rating.name }}</p>
            <StarRating :count="false" :values="rating.rating" />
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-2">
        <AppButton
          v-if="review.userID === user._id"
          title="Edit"
          class="mr-2"
          @click="edit"
        />
        <AppButton
          v-if="review.userID === user._id"
          title="Delete"
          class=""
          @click="deleteReview"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AReviewCard',

  props: {
    review: {
      type: Object,
      required: true,
    },

    admin: {
      type: Boolean,
      default: false,
    },

    editable: {
      type: Boolean,
      default: true,
    },

    deletetable: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    user() {
      return this.$store.state.user
    },

    overall() {
      let overall = {}
      this.review.ratings.forEach((rating) => {
        if (rating.name === 'Overall Delivery') overall = rating
      })

      return overall
    },
  },

  methods: {
    edit() {
      this.$emit('edit')
    },

    deleteReview() {
      this.$emit('delete')
    },
  },
}
</script>
