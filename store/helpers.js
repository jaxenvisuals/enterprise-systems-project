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
          return { label: label.trim(), options: {} }
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
        tableData.numbered = true
        resolve(tableData)
      } else {
        reject(new Error('Could not create table data'))
      }
    })
  } catch {
    return new Error('Could not create table data')
  }
}

export function validateUploads(key, headers) {
  headers = headers.map((h) => h.label)
  return new Promise((resolve, reject) => {
    const err = new Error(
      'The file uploaded cannot be verified across the selected dataset type.'
    )
    switch (key) {
      case 'airlines': {
        const rightHeaders = ['2 Letter Code', 'Company Name', 'Country']
        checkForHeadingExistence(rightHeaders, headers, reject, resolve, err)

        break
      }
      case 'airports': {
        const rightHeaders = [
          'IATA Code',
          'ISO Alpha 3 Code',
          'Long Name',
          'Long Location',
        ]
        checkForHeadingExistence(rightHeaders, headers, reject, resolve, err)
        break
      }
      case 'passengers': {
        const rightHeaders = [
          'Passport Number',
          'Flight Number',
          'Threat Level',
          'Forename',
          'Family Name',
          'Gender',
          'DOB',
          'Nationality',
          'Revenue',
          'Seat Number',
        ]
        checkForHeadingExistence(rightHeaders, headers, reject, resolve, err)
        break
      }
      case 'aircrafts': {
        const rightHeaders = [
          'Aircraft Number',
          'Passenger Capacity',
          'Crew Capacity',
        ]
        checkForHeadingExistence(rightHeaders, headers, reject, resolve, err)
        break
      }
      case 'flights': {
        const rightHeaders = [
          'Flight Number',
          'Aircraft',
          'Departure',
          'Arrival',
          'Terminal',
        ]
        checkForHeadingExistence(rightHeaders, headers, reject, resolve, err)
        break
      }
      case 'threats': {
        const rightHeaders = [
          'Threat ID',
          'Passport Number',
          'Threat Level',
          'Terrorism (50%)',
          'Smuggling (20%)',
          'Narcotics (15%)',
          'Illegal Immigration (15%)',
        ]
        checkForHeadingExistence(rightHeaders, headers, reject, resolve, err)
        break
      }

      default:
        return err
    }
  })
}

function checkForHeadingExistence(rightHeaders, headers, reject, resolve, err) {
  const found = rightHeaders.find((h) => {
    return !headers.includes(h)
  })
  if (found) {
    let requiredHeadersError = 'File must contain the following columns: '
    rightHeaders.forEach((h, i) => {
      requiredHeadersError +=
        i === rightHeaders.length - 1 ? 'and ' + h + '.' : h + ', '
    })
    err += ' ' + requiredHeadersError
    reject(err)
  } else {
    resolve()
  }
}
