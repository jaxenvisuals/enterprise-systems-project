<template>
  <div v-if="tableData.ready" class="w-full pt-8 pb-8 table-auto">
    <table class="w-full">
      <table-header :data="tableData.header" :numbered="tableData.numbered" />
      <table-body>
        <table-row
          v-for="(data, i) in tableData.body"
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
  },
}
</script>
