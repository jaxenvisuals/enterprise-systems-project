<template>
  <div
    v-if="tableData.ready"
    class="w-full pt-8 pb-8 bg-white border shadow-md table-auto"
  >
    <table class="w-full">
      <table-header :data="tableData.header" />
      <table-body>
        <table-row
          v-for="(data, i) in tableData.body"
          :key="i"
          :data="data"
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
  },
}
</script>
