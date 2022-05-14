<template>
  <div
    class="overflow-hidden border rounded-md a-toast w-80"
    :class="[toast.status || 'default']"
    @mouseenter="clearTimer"
    @mouseleave="setAutoCloseTimer"
  >
    <div class="py-3">
      <div class="flex items-center pl-4 pr-2">
        <p
          class="flex-grow text-xs font-bold leading-snug tracking-tight title"
        >
          {{ toast.title }}
        </p>
        <span class="cursor-pointer" @click="popToast(true)">
          <MaterialIcon icon="close" />
        </span>
      </div>
      <p class="px-4 mt-1 text-xs leading-snug tracking-tight">
        {{ toast.desc }}
      </p>
    </div>

    <div v-if="toast.errCode || toast.errMsg" class="px-4 py-1 code">
      <p class="text-[10px]">
        <span class="font-bold">Code {{ toast.errCode }}: </span>
        {{ toast.errMsg }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AToast',

  props: {
    toast: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      timeoutId: null,
    }
  },

  mounted() {
    this.setAutoCloseTimer()
  },

  methods: {
    clearTimer() {
      clearTimeout(this.timeoutId)
    },

    setAutoCloseTimer() {
      if (this.toast.autoClose) {
        this.timeoutId = setTimeout(() => {
          this.popToast()
        }, 5000)
      }
    },

    popToast(manual) {
      if (manual) this.clearTimer()
      this.$store.commit('popToast', { id: this.toast.id })
    },
  },
}
</script>

<style lang="postcss" scoped>
.a-toast {
  @apply bg-white shadow-lg;
}

.desc {
  @apply text-brand-gray;
}

.default {
  @apply border-brand-gray;
}

.default .title {
  @apply text-black;
}

.default .code {
  @apply bg-brand-gray text-white;
}

.success {
  @apply border-green-500;
}

.success .title {
  @apply text-green-500;
}

.success .code {
  @apply bg-green-500 text-white;
}

.error {
  @apply border-brand-red;
}

.error .title {
  @apply text-brand-red;
}

.error .code {
  @apply bg-brand-red text-white;
}
</style>
