<template>
  <div class="flex items-center">
    <div
      class="flex items-center mr-1 text-brand-yellow"
      :class="[{ 'gap-2': !tight }]"
    >
      <template v-for="(star, i) in values">
        <MaterialIcon
          v-if="star"
          :key="i"
          icon="star"
          :class="[starSize, 'text-yellow-600']"
        />
        <MaterialIcon v-else :key="i" icon="star_outline" :class="[starSize]" />
      </template>
    </div>
    <span
      v-if="count"
      class="
        ml-2
        inline-block
        text-brand-gray
        leading-snug
        tracking-tight
        text-sm
      "
    >
      {{ count }}
      <MaterialIcon icon="comment" class="text-xs" />
    </span>
  </div>
</template>

<script>
export default {
  name: 'StarRating',

  props: {
    count: {
      type: [Number, Boolean],
      default: false,
    },

    tight: {
      type: Boolean,
      default: true,
    },

    size: {
      type: String,
      default: null,
    },

    values: {
      type: Array,
      required: true,
    },
  },

  computed: {
    starSize() {
      let size = null
      switch (this.size) {
        case 'md':
          size = 'text-base'
          break

        case 'lg':
          size = 'text-lg'
          break

        case 'xl':
          size = 'text-3xl'
          break

        default:
          size = 'text-xs'
          break
      }

      return size
    },
  },
}
</script>
