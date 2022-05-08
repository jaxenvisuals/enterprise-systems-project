<template>
  <div class="px-4 py-6 text-black">
    <p class="text-lg font-bold">Threats</p>

    <div v-if="computedThreats" class="">
      <div class="border-b mt-4 mb-4 shadow">
        <button
          class="
            px-4
            py-3
            text-sm
            font-bold
            border-b
            flex
            justify-between
            items-center
            focus:outline-none
            rounded-none
            w-full
          "
          @click="toggleDataVisualization"
        >
          Visualize data

          <div class="flex items-center">
            <div class="flex gap-1 pr-2">
              <AppPills label="High" theme="high" />
              <AppPills label="Medium" theme="medium" />
              <AppPills label="Low" theme="low" />
            </div>

            <MaterialIcon
              :icon="visualizeData ? 'expand_less' : 'expand_more'"
              class="text-sm"
            />
          </div>
        </button>

        <div v-if="visualizeData" class="mt-2">
          <div class="mx-auto flex flex-col justify-center">
            <div class="px-4">
              <div class="grid grid-cols-4">
                <div class="">
                  <p class="text-center text-sm font-bold">
                    {{ threatCharts[0].title }}
                  </p>
                  <div
                    ref="e-pie-threat-category-1"
                    class="flex justify-center"
                  ></div>
                </div>
                <div class="">
                  <p class="text-center text-sm font-bold">
                    {{ threatCharts[1].title }}
                  </p>
                  <div
                    ref="e-pie-threat-category-2"
                    class="flex justify-center"
                  ></div>
                </div>
                <div class="">
                  <p class="text-center text-sm font-bold">
                    {{ threatCharts[2].title }}
                  </p>
                  <div
                    ref="e-pie-threat-category-3"
                    class="flex justify-center"
                  ></div>
                </div>
                <div class="">
                  <p class="text-center text-sm font-bold">
                    {{ threatCharts[3].title }}
                  </p>
                  <div
                    ref="e-pie-threat-category-4"
                    class="flex justify-center"
                  ></div>
                </div>
              </div>
            </div>

            <div>
              <div>
                <button
                  class="
                    text-center text-sm
                    font-bold
                    focus:outline-none
                    flex
                    justify-between
                    items-center
                    border-t border-b
                    px-4
                    py-3
                    w-full
                  "
                  @click="toggleThreatLevel"
                >
                  Threat Level
                  <MaterialIcon
                    :icon="threatLevelVisible ? 'expand_less' : 'expand_more'"
                    class="text-sm"
                  />
                </button>
              </div>
              <div
                v-if="threatLevelVisible"
                ref="e-pie-threat-level"
                class="flex justify-center px-4 mb-4"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <CustomTable :table-data="computedThreats.tableData" sortable />
    </div>
  </div>
</template>

<script>
import { initThreatCategory, initThreatLevel } from '~/store/charts'

export default {
  name: 'ThreatsPage',

  data() {
    return {
      visualizeData: false,
      threatLevelVisible: false,
      threatCharts: [
        {
          title: 'Terrorism',
        },
        {
          title: 'Smuggling',
        },
        {
          title: 'Narcotics',
        },
        {
          title: 'Illegal Immigration',
        },
      ],
    }
  },

  computed: {
    computedThreats() {
      return this.$store.getters.computedThreats || null
    },
  },

  mounted() {
    setTimeout(() => {
      if (this.computedThreats?.tableData) {
        this.toggleDataVisualization()
      }
    }, 20)
  },

  methods: {
    initThreatLevel() {
      const here = this
      initThreatLevel(here)
    },

    initThreatCategory() {
      const here = this
      initThreatCategory(here)
    },

    toggleDataVisualization() {
      this.visualizeData = !this.visualizeData
      if (this.visualizeData) {
        setTimeout(() => {
          if (this.computedThreats) {
            this.initThreatCategory()
          }
        }, 10)
      } else {
        this.threatLevelVisible = false
      }
    },

    toggleThreatLevel() {
      if (this.visualizeData) {
        this.threatLevelVisible = !this.threatLevelVisible
        if (this.threatLevelVisible) {
          setTimeout(() => {
            this.initThreatLevel()
          }, 30)
        }
      }
    },
  },
}
</script>
