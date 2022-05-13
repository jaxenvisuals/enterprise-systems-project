<template>
  <div class="px-4 py-6 text-black">
    <p class="text-lg font-bold">Upload Data File</p>

    <div class="mt-4">
      <div class="grid grid-cols-12">
        <div class="col-span-3">
          <p class="text-sm font-bold leading-none">Select Dataset to upload</p>
          <div class="mt-1">
            <SelectMenu
              v-model="set"
              :value="set"
              :options="options"
              label-key="name"
              value-key="value"
            />

            <p
              v-if="file.tried && !file.name"
              class="mt-px text-xs leading-none"
            >
              {{ 'No file selected' }}
            </p>
          </div>

          <div class="mt-1">
            <AppButton
              :title="`${
                file.name && file.tried
                  ? 'Change File (' + file.name + ')'
                  : 'Upload File'
              }`"
              dark
              class="mb-3"
              @click="showFileUploader"
            />
          </div>
        </div>
      </div>
    </div>
    <input
      :ref="id"
      type="file"
      class="hidden"
      accept=".json, .xlsx, .xls, .xml"
      @change="processFile($event)"
    />

    <div v-if="tableVisible" class="mt-5">
      <div class="flex justify-end mb-3">
        <AppButton
          :title="`Save Data Set`"
          dark
          class="mb-3"
          @click="saveDataSet"
        />
      </div>
      <CustomTable :table-data="tableData" />
    </div>
  </div>
</template>

<script>
import {
  excelToJSON,
  createTableData,
  validateUploads,
  fileTypeChecker,
  processJSONFile,
  processXMLFile,
  nameMapping,
  refineApiData,
} from '@/store/helpers'
import { dataSets } from '@/store/constants'
export default {
  name: 'UploadFile',

  data() {
    const w = process.client ? window : null

    return {
      w,
      set: null,
      file: {
        tried: null,
        name: null,
        raw: null,
        rawConvertedData: null,
      },

      id: 0,

      options: dataSets,

      tableVisible: false,
      tableData: {
        ready: false,
        error: null,
        header: null,
        body: null,
      },
    }
  },

  watch: {
    set(val) {
      if (!val) {
        this.clearTable()
      }
    },
  },

  mounted() {
    this.id = this.$uuid()
  },

  methods: {
    showFileUploader() {
      if (!this.set) {
        return alert('Select a dataset type you wish to upload')
      }
      this.$refs[this.id].click()
    },

    processFile(e) {
      this.file.tried = true
      const file = e?.target?.files[0]
      if (!file) {
        this.clearTable()
        return alert('Select a file')
      }
      const extension = fileTypeChecker(file.name)
      if (!extension) {
        return alert(
          'Invalid file. You can only upload files in either a JSON, XML, Microsoft Access DB or excel format'
        )
      }

      this.file.name = file.name
      this.file.raw = file

      switch (true) {
        case extension === 'json': {
          this.processJSONFile(e)
          break
        }

        case extension === 'xlsx' || extension === 'xls': {
          this.convertExcelToJSON(e)
          break
        }

        case extension === 'xml': {
          this.processXMLFile(e)
          break
        }

        default:
          alert('Not sure of the content of this file')
          break
      }
    },

    convertExcelToJSON(file) {
      excelToJSON(file)
        .then((data) => {
          this.file.rawConvertedData = data
          this.createTableData(data)
        })
        .catch((err) => {
          this.clearTable(err)
          alert(err)
        })
    },

    processJSONFile(file) {
      processJSONFile(file)
        .then((data) => {
          this.file.rawConvertedData = data
          this.createTableData(data)
        })
        .catch((err) => {
          this.clearTable(err)
          alert(err)
        })
    },

    processXMLFile(file) {
      processXMLFile(file)
        .then((data) => {
          this.file.rawConvertedData = data
          this.createTableData(data)
        })
        .catch((err) => {
          this.clearTable(err)
          alert(err)
        })
    },

    createTableData(data) {
      try {
        createTableData(data).then((tableData) => {
          this.tableData = tableData
          this.tableVisible = true
        })
      } catch (err) {
        this.clearTable(err)
      }
    },

    clearTable(err) {
      this.file.raw = null
      this.file.rawConvertedData = null
      this.file.name = null
      this.tableVisible = false
      this.tableData.error = err
      this.tableData.ready = false
      this.tableData.body = null
      this.tableData.header = null
    },

    saveDataSet() {
      try {
        validateUploads(this.set, this.tableData.header)
          .then(() => {
            let payload = JSON.parse(JSON.stringify(this.tableData))

            const keys = payload.header.map((p) => p.label)
            payload = payload.body.map((p) => {
              const obj = {}
              keys.forEach((k, i) => {
                const mapped = nameMapping(k, true)
                if (mapped !== k) {
                  obj[mapped] = p.values[i].label
                }
              })

              return obj
            })

            this.saveToDB(payload)
          })
          .catch((err) => {
            alert(err)
          })
      } catch (err) {}
    },

    saveToDB(payload) {
      this.$axios({
        url: this.set + '/import',
        method: 'POST',
        data: payload,
      })
        .then(({ data }) => {
          refineApiData({ data: data.data })
            .then((data) => {
              this.$store.commit('setDataSets', {
                key: this.set,
                value: {
                  raw: null,
                  tableData: JSON.parse(JSON.stringify(data)),
                },
              })
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>
