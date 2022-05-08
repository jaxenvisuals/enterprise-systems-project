<template>
  <span
    class="
      inline-block
      text-xs
      bg-red-500
      text-white
      leading-none
      tracking-tight
      rounded-full
      px-2
      py-1
    "
    :class="theme"
    >{{ label }}</span
  >
</template>

<script>
export default {
  name: 'AppPills',

  props: {
    theme: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
}
</script>
