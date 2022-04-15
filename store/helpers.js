export function excelToJSON(file) {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      const w = window
      if (w) {
        reader.onload = function (e) {
          const data = e.target.result
          const workbook = w.XLSX.read(data, {
            type: 'binary',
          })

          workbook.SheetNames.forEach(function (sheetName) {
            // Here is your object
            const XLRowObject = w.XLSX.utils.sheet_to_row_object_array(
              workbook.Sheets[sheetName]
            )
            const jsonObject = JSON.stringify(XLRowObject)
            resolve(jsonObject)
          })
        }

        reader.onerror = function (err) {
          reject(new Error('ERROR', err))
        }

        reader.readAsBinaryString(file.target.files[0])
      }
    })
  } catch {
    return new Error('Could not convert File')
  }
}

export function createTableData(data) {
  try {
    const tableData = {}
    return new Promise((resolve, reject) => {
      const uploadedData = JSON.parse(data)
      console.log('Uploaded', uploadedData)
      if (uploadedData.length) {
        const tableKeys = Object.keys(uploadedData[0])
        console.log('Keys', tableKeys)
        const headerLabels = tableKeys.map((label) => {
          return { label, options: {} }
        })
        console.log('Header Labels', headerLabels)
        const headers = [...headerLabels]
        tableData.header = headers
        console.log('Header Labels', headerLabels)

        const bodyData = uploadedData.map((row) => {
          const rowData = []
          tableKeys.forEach((k) => {
            rowData.push({
              label: row[k],
              options: {},
            })
          })
          return {
            values: [...rowData],
            options: {},
          }
        })
        console.log('BodyData', bodyData)
        const tableBody = bodyData

        tableData.body = tableBody
        tableData.error = null
        tableData.ready = true
        resolve(tableData)
      } else {
        reject(new Error('Could not create table data'))
      }
    })
  } catch {
    return new Error('Could not create table data')
  }
}
