<template>
  <div
    class="px-4 py-4 toast-container toast-index"
    :class="[{ 'pointer-events-none': !toasts.length }]"
  >
    <div class="relative w-80">
      <transition-group
        tag="div"
        :name="'list'"
        class="relative flex flex-col gap-2"
        appear
      >
        <AToast v-for="toast in toasts" :key="toast.id" :toast="toast" />
      </transition-group>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ToastNotifications',

  computed: {
    ...mapState({
      toasts: (state) => state.toasts,
    }),
  },
}
</script>

<style lang="postcss" scoped>
.toast-container {
  @apply absolute top-0 right-0;
}
</style>

<style lang="postcss">
.list-enter {
  opacity: 0;
  transform: scale(0.6);
}

.list-enter-active {
  transition: all 0.4s ease;
}

.list-leave-from {
  opacity: 1;
  transform: scale(1);
}

.list-leave-active {
  transition: all 0.4s ease;
  position: absolute;
  bottom: 0;
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

.list-move {
  transition: all 0.3s ease;
}
</style>
