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
          <p class="text-xl font-bold">Create Restaurant</p>
        </div>

        <div class=""><AppButton title="Cancel" @click="closeModal" /></div>
      </div>

      <div class="mt-6">
        <div class="flex flex-col gap-2">
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="col-span-1">
              <AppInput
                v-model="form.name"
                label="Restaurant Name"
                placeholder="Restaurant Name"
              />
            </div>

            <div class="col-span-1">
              <AppInput
                v-model="form.location"
                label="Restaurant Location"
                placeholder="Restaurant Location"
              />
            </div>

            <div class="col-span-1">
              <AppInput
                v-model.number="form.minCost"
                label="Minimum Cost in Pounds (£)"
                placeholder="Minimum Cost in Pounds (£)"
                input-type="number"
              />
            </div>

            <div class="col-span-1">
              <AppInput
                v-model.number="form.maxCost"
                label="Maximum Cost in Pounds (£)"
                placeholder="Maximum Cost in Pounds (£)"
                input-type="number"
              />
            </div>
          </div>

          <AddRestaurantCard
            v-for="template in restaurantTemplate"
            :key="template.name"
            :template="template"
            :form="form"
            @input="updateForm(template.key, $event)"
          />
        </div>

        <div class="flex-col flex mt-4">
          <AppButton
            :title="this['new'] ? 'Create Restaurant' : 'Update Restaurant'"
            dark
            class="mb-3"
            @click="processForm"
          />

          <AppButton title="Cancel" @click="closeModal" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateRestaurant',

  props: {
    restaurant: {
      type: Object,
      default: () => {},
    },

    new: {
      type: Boolean,
      required: true,
    },
  },

  data: () => {
    return {
      form: {
        name: null,
        location: null,
        minCost: 0,
        maxCost: 0,
        service: [],
        cuisine: [],
        occasion: [],
        meals: [],
      },
    }
  },

  computed: {
    restaurantTemplate() {
      return this.$store.state.restaurantTemplate
    },
  },

  mounted() {
    if (this.new) {
      this.form = {}
    } else {
      this.form = this.restaurant
    }
  },

  methods: {
    updateForm(key, value) {
      this.form[key] = value
    },

    processForm() {
      this.saveRestaurant()
    },

    saveRestaurant() {
      const form = { ...this.form }
      if (!this.new) delete form._id

      return this.$axios({
        method: 'POST',
        url: this.new ? 'api/restaurant' : 'api/restaurant/' + this.form._id,
        data: JSON.stringify(this.form),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          console.log(res)
          this.closeModal(true)
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {})
    },

    closeModal(e = false) {
      this.$emit('close', e)
    },
  },
}
</script>
