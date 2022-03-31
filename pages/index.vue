<template>
  <div v-if="false" class="flex flex-col items-center w-full mt-40">
    <div class="text-center text-black">
      <p class="text-6xl">Find a Restaurant</p>

      <div class="flex justify-center">
        <p class="w-2/4 mt-3 text-sm">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non
          reiciendis ad voluptas? Rerum animi est, suscipit nemo eveniet culpa
          consequatur, similique sequi distinctio quibusdam, repellendus
          incidunt doloribus! Error, repellat tempora.
        </p>
      </div>
    </div>

    <div class="w-3/5 mt-4">
      <div class="relative bg-[#e7e7e7] rounded-full w-full flex">
        <div
          class="
            px-6
            py-4
            flex
            items-center
            justify-center
            flex-grow-0
            text-[#626161]
          "
        >
          <MaterialIcon class="text-xl" icon="filter_alt" />
        </div>

        <input
          type="text"
          class="
            py-4
            block
            h-full
            flex-grow
            text-xl
            focus:outline-none
            text-[#626161]
            bg-[#e7e7e7]
          "
          placeholder="Find a restaurant"
        />

        <div
          class="
            px-6
            py-4
            flex
            items-center
            justify-center
            flex-grow-0
            text-[#626161]
          "
        >
          <MaterialIcon class="text-2xl" icon="search" />
        </div>
      </div>
    </div>

    <div class="mt-4 text-lg text-center">
      Don't have any in mind?
      <span class="underline">View all restaurants</span>
    </div>

    <div class="w-4/5 mt-6">
      <div class="flex items-center justify-between">
        <div class="text-xl">Featured Restaurants</div>

        <div class="flex items-center">
          <div class="pr-4 text-base leading-none">See all restaurants</div>

          <span class="">
            <MaterialIcon icon="arrow_forward_ios" class="text-lg" />
          </span>
        </div>
      </div>

      <div class="grid grid-cols-5 gap-12 mt-4">
        <div v-for="i in 5" :key="i" class="">
          <div class="bg-[#c4c4c4] h-44 rounded-lg"></div>

          <div class="mt-3 text-black">
            <div
              class="
                inline-flex
                px-2
                py-px
                text-xs text-black
                rounded-sm
                bg-app-gray-100
              "
            >
              <span class="inline-block mr-1">
                <MaterialIcon icon="emoji_events" class="text-xs" />
              </span>

              <span class="font-bold"> TOP #1 </span>
            </div>
            <div class="mt-px">
              <p class="text-lg font-medium leading-snug">Lorem Ipsum Dolor</p>
              <p class="mt-px text-xs">
                Lorem ipsum dolor sit amet consectetur adipisicing elit...
              </p>
            </div>

            <div class="flex items-center mt-px text-black">
              <span class="inline-block mr-1">
                <MaterialIcon icon="place" class="text-xs" />
              </span>

              <span class="inline-block text-xs">Stoke-on-Trent, Uk</span>
            </div>

            <div class="mt-px">
              <StarRating :values="[]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  mounted() {
    this.$router.push('/home')
  },
}
</script>
