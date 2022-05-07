<template>
  <div v-if="tableData.ready" class="w-full pt-8 pb-8 table-auto">
    <table class="w-full">
      <table-header
        :data="sorted.header"
        :numbered="tableData.numbered"
        :sort-key="sortIndex"
        :sortable="sortable"
        @sort="updateSortKey"
      />
      <table-body>
        <table-row
          v-for="(data, i) in sorted.body"
          :key="i"
          :data="data"
          :options="options"
          :numbered="tableData.numbered"
          :index="i"
          @click="handleRowClick($event, i)"
        ></table-row>
      </table-body>
    </table>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'CustomTable',

  props: {
    tableData: {
      type: Object,
      required: true,
    },

    options: {
      type: [Object, Boolean],
      default: false,
    },

    sortable: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      sortIndex: null,
      asc: true,
    }
  },

  computed: {
    sorted() {
      if (!(this.sortIndex !== null && this.sortIndex !== undefined))
        return this.tableData

      const data = JSON.parse(JSON.stringify(this.tableData))

      const sorted = _.sortBy(data.body, (k) => {
        return Number(k.values[this.sortIndex].label)
          ? Number(k.values[this.sortIndex].label)
          : k.values[this.sortIndex].label
      })

      data.body = this.asc ? sorted : sorted.reverse()
      return data
    },
  },

  methods: {
    handleRowClick({ data }, index) {
      if (this.options.clickable) {
        this.options.events.handleRowClick({
          instanceData: this.tableData,
          index,
          rowData: data,
        })
      }
    },

    updateSortKey(k) {
      if (k === this.sortIndex) {
        this.sortIndex = k
        this.asc = !this.asc
        return
      }
      this.sortIndex = k
      this.asc = true
    },
  },
}
</script>
