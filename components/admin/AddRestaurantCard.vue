<template>
  <div class="border rounded-xl px-4 py-3 shadow bg-white/60">
    <div class="">
      <p class="text-base font-bold">{{ template.name }}</p>
      <p class="text-xs">
        {{ template.description }}
      </p>
    </div>

    <div class="mt-4">
      <div class="flex flex-col gap-2">
        <div
          v-if="selected.length"
          class="flex flex-wrap pb-2 border-b border-black"
        >
          <div v-for="val in selected" :key="val" class="pr-3 pb-3 text-black">
            <div
              class="
                cursor-pointer
                rounded-full
                px-4
                py-2
                border
                text-xs
                items-center
                justify-center
                flex
                font-bold
              "
              role="button"
              @click="select(val)"
            >
              <span class="inline-block mr-3">{{ val }}</span>

              <MaterialIcon icon="close" class="text-base" />
            </div>
          </div>
        </div>

        <div class="flex flex-wrap mt-2">
          <template v-for="field in template.fields">
            <div
              v-if="
                !selected.includes(field.name) && restaurantSupportsIt(field)
              "
              :key="field.name"
              class="pr-3 pb-3 text-black"
            >
              <div
                class="
                  cursor-pointer
                  rounded-full
                  px-4
                  py-2
                  border
                  text-xs
                  items-center
                  justify-center
                  flex
                  font-bold
                "
                role="button"
                @click="select(field.name)"
              >
                <span class="inline-block mr-3">{{ field.name }}</span>

                <MaterialIcon icon="add" class="text-base" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddRestaurantCard',

  props: {
    forReview: {
      type: Boolean,
      default: false,
    },

    type: {
      type: String,
      default: 'rating',
    },

    placeholder: {
      type: String,
      default: 'Text here',
    },

    template: {
      type: Object,
      required: true,
    },

    form: {
      type: Object,
      default: () => {},
    },

    restaurant: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      selected: [],
    }
  },

  computed: {
    restaurantSupportsIt() {
      return (field) => {
        if (!this.forReview) {
          return true
        }

        const index = this.restaurant.options.findIndex((res) => {
          return res.name === this.template.name
        })

        if (index < 0) return false

        return this.restaurant.options[index].value.includes(field.name)
      }
    },
  },

  mounted() {
    setTimeout(() => {
      if (this.form[this.template.key]) {
        this.form[this.template.key].forEach((val) => {
          this.select(val)
        })
        this.$emit('input', this.selected)
      } else {
        this.$emit('input', [])
      }
    }, 5)
  },

  methods: {
    select(value) {
      if (!this.selected.includes(value)) {
        this.selected.push(value)
      } else {
        const i = this.selected.findIndex((val) => {
          return val === value
        })

        if (i < 0) {
          return
        }
        this.selected.splice(i, 1)
      }

      this.$emit('input', this.selected)
    },
  },
}
</script>
