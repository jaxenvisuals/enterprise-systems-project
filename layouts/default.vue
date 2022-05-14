<template>
  <div v-if="loaded" class="min-h-screen bg-gray-50">
    <div class="grid h-screen grid-cols-12">
      <!-- sidebar -->
      <div class="h-full col-span-2 text-black bg-white border-r">
        <p class="px-4 py-5 text-lg font-bold leading-snug uppercase">
          Dashboard
        </p>

        <!-- menu -->
        <div class="mt-3 leading-snug text-black">
          <nuxt-link
            to="/"
            exact-active-class="font-bold bg-gray-50"
            class="flex flex-col text-sm"
          >
            <div class="px-4 py-3">Dashboard</div>
          </nuxt-link>
          <nuxt-link
            to="/upload"
            exact-active-class="font-bold bg-gray-50"
            class="flex flex-col text-sm"
          >
            <div class="px-4 py-3">Upload Data File</div>
          </nuxt-link>
          <nuxt-link
            v-for="link in dataSets"
            :key="link.value"
            :to="link.url"
            exact-active-class="font-bold bg-gray-50"
            class="flex flex-col text-sm"
          >
            <div class="flex justify-between px-4 py-3">
              <span>{{ link.name }}</span>
              <span>{{ dataLength(link) }}</span>
            </div>
          </nuxt-link>
        </div>
      </div>
      <div class="col-span-10 bg-gray-50">
        <!-- navbar -->
        <div class="px-4 py-5 bg-white">
          <div class="flex justify-end">
            <div class="">
              <MaterialIcon class="text-sm" icon="power_settings_new" />
            </div>
          </div>
        </div>
        <div class="body">
          <Nuxt />
        </div>
      </div>
    </div>
    <!-- rendered classes from JS file  to be included in tailwind -->
    <div
      class="
        bg-red-400
        bg-[#67e0e3]
        bg-[#37a2da]
        bg-[#fd666c]
        bg-opacity-60
        bg-yellow-400
        text-white
      "
    ></div>

    <ToastNotifications />
  </div>
</template>

<script>
import { dataSets } from '@/store/constants'
import { refineApiData } from '@/store/helpers'

export default {
  name: 'DefaultLayout',

  data() {
    return {
      loaded: true,
      dataSets,
    }
  },

  computed: {
    stateDataSet() {
      return this.$store.getters.dataSets
    },

    dataLength() {
      return (link) => {
        return this.stateDataSet[link.value]?.tableData?.body?.length || ''
      }
    },
  },

  mounted() {
    // this.getState()
    this.initApp()
  },

  methods: {
    getState() {
      const state = localStorage.getItem('state')
      if (!state) return
      this.$store.commit('setState', JSON.parse(state))
    },

    initApp() {
      const api = [
        'airlines',
        'airports',
        'aircrafts',
        'flights',
        'passengers',
        'threats',
      ]
      const promises = []
      api.forEach((a) => {
        promises.push(
          this.$axios({
            method: 'GET',
            url: a,
          })
            .then(({ data }) => {
              refineApiData({ data })
                .then((data) => {
                  this.$store.commit('setDataSets', {
                    key: a,
                    value: { raw: null, tableData: data },
                  })
                })
                .catch((err) => {
                  console.log(err)
                })
            })
            .catch((err) => {
              console.log(err)
            })
        )
      })

      Promise.all(promises).then(() => {
        this.$store.commit('pushToast', {
          title: 'Datasets Loaded',
          desc: `All datasets have been loaded. Threat data ready for visualisation`,
          status: 'success',
          errCode: '',
          errMsg: '',
          autoClose: true,
        })
      })
    },
  },
}
</script>

<style lang="postcss" scoped>
.body {
  height: calc(100vh - 64px);
  overflow: auto;
}
</style>

<style lang="postcss">
.low {
  @apply bg-[#67e0e3];
}
.medium {
  @apply bg-[#37a2da];
}
.high {
  @apply bg-[#fd666c];
}
</style>
