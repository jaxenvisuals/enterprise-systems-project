<template>
  <div class="px-4 py-6 text-black">
    <p class="text-lg font-bold">Upload Data File</p>

    <div class="mt-4">
      <div class="grid grid-cols-12">
        <div class="col-span-3">
          <p class="text-sm font-bold leading-none">Select Dataset to upload</p>
          <div class="mt-1">
            <SelectMenu
              v-model="form.set"
              :value="form.set"
              :options="options"
              label-key="name"
              value-key="value"
            />

            <p v-if="file.tried" class="mt-px text-xs leading-none">
              {{ file.name || 'No file selected' }}
            </p>
          </div>

          <div class="mt-1">
            <AppButton
              title="Upload File"
              dark
              class="mb-3"
              @click="showFileUploader"
            />
          </div>
        </div>
      </div>
    </div>
    <input :ref="id" type="file" class="hidden" @change="processFile($event)" />

    <div class="mt-5">
      <CustomTable :table-data="tableData" />
    </div>
  </div>
</template>

<script>
import { excelToJSON, createTableData } from '@/store/helpers'
export default {
  name: 'UploadFile',

  data() {
    const w = process.client ? window : null

    return {
      w,
      form: {
        set: null,
      },
      file: {
        tried: null,
        name: null,
        raw: null,
      },

      id: 0,

      options: [
        {
          name: 'Airplanes',
          value: 'airplanes',
        },
        {
          name: 'Passengers',
          value: 'passengers',
        },
      ],

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
    this.id = this.$uuid()
  },

  methods: {
    showFileUploader() {
      this.$refs[this.id].click()
    },

    processFile(e) {
      this.file.tried = true
      const file = e?.target?.files[0]
      if (!file) {
        this.file.raw = null
        this.file.name = null
        return alert('Select a file')
      }
      this.file.raw = file
      this.file.name = file.name

      this.convertExcelToJSON(e)
    },

    convertExcelToJSON(file) {
      excelToJSON(file)
        .then((data) => {
          console.log('DATA', data)
          this.createTableData(data)
        })
        .catch((err) => {
          alert(err)
        })
    },

    createTableData(data) {
      try {
        createTableData(data).then((tableData) => {
          this.tableData = tableData
        })
      } catch (err) {
        console.log(err)
        this.tableData.error = err
        this.tableData.ready = false
        this.tableData.body = null
        this.tableData.header = null
      }
    },
  },
}
</script>
