<template>
  <div class="mt-4 mb-4 border-b shadow">
    <button
      class="flex items-center justify-between w-full px-4 py-3 text-sm font-bold border-b rounded-none  focus:outline-none"
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
      <div class="flex flex-col justify-center mx-auto">
        <div class="px-4">
          <div class="grid grid-cols-4">
            <div class="">
              <p class="text-sm font-bold text-center">
                {{ threatCharts[0].title }}
              </p>
              <div
                ref="e-pie-threat-category-1"
                class="flex justify-center"
              ></div>
            </div>
            <div class="">
              <p class="text-sm font-bold text-center">
                {{ threatCharts[1].title }}
              </p>
              <div
                ref="e-pie-threat-category-2"
                class="flex justify-center"
              ></div>
            </div>
            <div class="">
              <p class="text-sm font-bold text-center">
                {{ threatCharts[2].title }}
              </p>
              <div
                ref="e-pie-threat-category-3"
                class="flex justify-center"
              ></div>
            </div>
            <div class="">
              <p class="text-sm font-bold text-center">
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
              class="flex items-center justify-between w-full px-4 py-3 text-sm font-bold text-center border-t border-b  focus:outline-none"
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
</template>

<script>
import { initThreatCategory, initThreatLevel } from '~/store/charts'

export default {
  name: 'CollapsibleChart',

  props: {
    data: {
      type: Object,
      default: null,
    },

    opened: {
      type: Boolean,
      default: true,
    },
  },

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
      computedThreatsData: null,
      charts: {
        ter: null,
        smu: null,
        nar: null,
        ill: null,
        lev: null,
      },
    }
  },

  computed: {
    computedThreats() {
      return this.$store.getters.computedThreats || null
    },
  },

  watch: {
    data: {
      deep: true,
      handler(v) {
        this.computedThreatsData = v

        if (!this.computedThreatsData) return

        if (this.visualizeData) {
          setTimeout(() => {
            initThreatCategory(this, true)
          }, 10)
        }

        if (this.threatLevelVisible) {
          setTimeout(() => {
            initThreatLevel(this, true)
          }, 30)
        }
      },
    },
  },

  mounted() {
    this.visualizeData = !this.opened

    setTimeout(() => {
      if (this.data?.tableData) {
        this.computedThreatsData = this.data
        this.toggleDataVisualization()
      } else if (this.computedThreats?.tableData) {
        this.computedThreatsData = this.computedThreats
        this.toggleDataVisualization()
      }
    }, 20)
  },

  methods: {
    initThreatLevel() {
      const here = this
      initThreatLevel(here, Boolean(this.charts.lev))
    },

    initThreatCategory() {
      const here = this
      initThreatCategory(here, Boolean(this.charts.ter))
    },

    toggleDataVisualization() {
      this.visualizeData = !this.visualizeData
      if (this.visualizeData) {
        setTimeout(() => {
          if (this.computedThreatsData) {
            this.initThreatCategory()
          }
        }, 10)
      } else {
        this.threatLevelVisible = false
        this.charts.ter = null
        this.charts.smu = null
        this.charts.nar = null
        this.charts.ill = null
      }
    },

    toggleThreatLevel() {
      if (this.visualizeData) {
        this.threatLevelVisible = !this.threatLevelVisible
        if (this.threatLevelVisible) {
          setTimeout(() => {
            this.initThreatLevel()
          }, 30)
        } else {
          this.charts.lev = null
        }
      }
    },
  },
}
</script>
