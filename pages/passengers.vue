<template>
  <div class="px-4 py-6 text-black">
    <p class="text-lg font-bold">Passengers Data</p>

    <div class="mt-4">
      <CustomTable :table-data="tableData" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PassengerData',

  data() {
    return {
      tableData: {
        ready: false,
        error: null,
        header: null,
        body: null,
      },
    }
  },

  computed: {},

  mounted() {
    this.createTableData()
  },

  methods: {
    createTableData(tableData) {
      try {
        const headers = [
          {
            label: 'Date',
            options: {},
          },
          {
            label: 'First Name',
            options: {},
          },
          {
            label: 'Last Name',
            options: {},
          },
          {
            label: 'Email',
            options: {},
          },
          {
            label: 'Phone Number',
            options: {},
          },
        ]
        this.tableData.header = headers

        const tableBody = {
          values: [
            {
              label: 'Date',
              options: {},
            },
            {
              label: 'Label',
              options: {},
            },
            {
              label: 'Label',
              options: {},
            },
            {
              label: 'Label',
              options: {},
            },
            {
              label: 'Label',
              options: {},
            },
          ],
          options: {},
        }

        this.tableData.body = tableBody
        this.tableData.error = null
        this.tableData.ready = true
      } catch {
        this.tableData.error = 'Could not show table. Please contact manager'
        this.tableData.ready = false
        this.tableData.body = null
        this.tableData.header = null
      }
    },
  },
}
</script>
