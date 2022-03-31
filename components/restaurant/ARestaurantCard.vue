<template>
  <div class="overflow-hidden bg-white border rounded-xl">
    <div
      v-if="position"
      class="
        px-3
        py-1
        text-xs
        font-bold
        bg-[#c4c4c4] bg-opacity-25
        uppercase
        border-b
      "
    >
      #{{ positionNumber }} in top restaurants
    </div>
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
              <div class="mt-px flex items-center">
                <StarRating
                  class="mr-3"
                  :count="
                    restaurant.reviews ? restaurant.reviews.length : false
                  "
                  :values="overall.rating"
                />

                <p class="text-xs">
                  £{{ restaurant.cost.min }} - £{{ restaurant.cost.max }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-3 text-sm">
            <div
              v-for="(option, i) in restaurant.options"
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
          </div>
        </div>
        <div class="flex flex-col w-2/5 gap-1">
          <div
            v-for="(rating, i) in restaurant.ratings"
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
          v-if="viewable"
          :button="false"
          :url="'/restaurant/' + restaurant._id"
          title="View"
          class="mr-2"
        />
        <AppButton v-if="editable" title="Edit" class="mr-2" @click="edit" />
        <AppButton
          v-if="deletetable"
          title="Delete"
          class=""
          @click="deleteRestaurant"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ARestaurantCard',

  props: {
    restaurant: {
      type: Object,
      required: true,
    },

    admin: {
      type: Boolean,
      default: false,
    },

    viewable: {
      type: Boolean,
      default: true,
    },

    editable: {
      type: Boolean,
      default: true,
    },

    deletetable: {
      type: Boolean,
      default: true,
    },

    position: {
      type: Boolean,
      default: false,
    },

    positionNumber: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    overall() {
      let overall = {}
      this.restaurant.ratings.forEach((rating) => {
        if (rating.name === 'Overall Delivery') overall = rating
      })

      return overall
    },
  },

  methods: {
    edit() {
      this.$emit('edit')
    },

    async deleteRestaurant() {
      await this.$store.dispatch('deleteRestaurant', {
        id: this.restaurant._id,
      })
    },
  },
}
</script>
