<template>
  <div v-if="show" class="border rounded-xl px-4 py-3 shadow bg-white/60">
    <div class="">
      <p class="text-base font-bold">{{ template.name }}</p>
      <p class="text-xs">
        {{ template.description }}
      </p>
    </div>

    <div class="mt-4">
      <div v-if="type === 'rating'" class="flex flex-col gap-2">
        <div
          v-for="field in template.fields"
          :key="field.name"
          class="flex items-center"
        >
          <div class="w-2/5">
            <p class="text-sm font-bold leading-none">{{ field.name }}</p>
          </div>
          <div class="flex-grow">
            <!-- <StarRating size="lg" :count="false" :tight="false" />
             -->
            <SelectMenu
              v-model="form[field.key]"
              :value="form[field.key]"
              :options="options"
              label-key="name"
              value-key="value"
              @input="emitInput"
            />
          </div>
        </div>
      </div>

      <div v-else-if="type === 'textarea'" class="">
        <textarea
          v-model="text"
          class="
            border
            rounded-xl
            text-sm
            px-4
            py-3
            focus:outline-none
            bg-transparent
            w-full
          "
          cols="30"
          rows="10"
          :placeholder="placeholder"
          @change="updateInput"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AStarReviewCard',

  props: {
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

    review: {
      type: Object,
      default: () => {},
    },

    isNew: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      form: {},
      text: '',
      show: false,

      options: [
        {
          name: 'Excellent',
          value: 5,
        },
        {
          name: 'Very Good',
          value: 4,
        },
        {
          name: 'Average',
          value: 3,
        },
        {
          name: 'Poor',
          value: 2,
        },
        {
          name: 'Terrible',
          value: 1,
        },
      ],
    }
  },

  mounted() {
    if (!this.isNew) {
      if (this.type === 'textarea') {
        this.text = this.review.comment ? this.review.comment : ''
        this.updateInput()
      } else {
        this.template.fields.forEach((field) => {
          if (this.review[field.key]) {
            this.form[field.key] = this.review[field.key]
          }
        })
        this.emitInput()
      }
    } else if (this.type === 'textarea') {
      this.text = ''
      this.updateInput()
    } else {
      this.template.fields.forEach((field) => {
        if (this.review[field.key]) {
          this.form[field.key] = null
        }
      })
      this.emitInput()
    }

    setTimeout(() => {
      this.show = true
    }, 10)
  },

  methods: {
    emitInput() {
      this.$emit('input', this.form)
    },

    updateInput() {
      this.$emit('input', this.text)
    },
  },
}
</script>
