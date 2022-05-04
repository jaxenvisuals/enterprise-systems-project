import { Parser } from 'xml2js'

const names = [
  ['2 Letter Code', '_2_Letter_Code'],
  ['Company Name', 'Company_Name'],
  ['Country'],
  ['IATA Code', 'IATA_Code'],
  ['ISO Alpha 3 Code', 'ISO_Alpha_3_Code'],
  ['Long Name', 'Long_Name'],
  ['Long Location', 'Long_Location'],
  ['Passport Number', 'Passport_Number'],
  ['Flight Number', 'Flight_Number'],
  ['Forename'],
  ['Family Name', 'Family_Name'],
  ['Gender'],
  ['DOB'],
  ['Nationality'],
  ['Revenue'],
  ['Seat Number', 'Seat_Number'],
  ['Aircraft Number', 'Aircraft_Number'],
  ['Passenger Capacity', 'Passenger_Capacity'],
  ['Crew Capacity', 'Crew_Capacity'],
  ['Aircraft'],
  ['Departure'],
  ['Arrival'],
  ['Terminal'],
  ['Threat ID', 'Threat_ID'],
  ['Threat Level', 'Threat_Level'],
  ['Terrorism (50%)', 'Terrorism_50'],
  ['Smuggling (20%)', 'Smuggling_20'],
  ['Narcotics (15%)', 'Narcotics_15'],
  ['Illegal Immigration (15%)', 'Illegal_Immigration_15'],
]

export function excelToJSON(file) {
  return new Promise((resolve, reject) => {
    try {
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

        reader.onerror = function () {
          reject(
            new Error('There was an error parsing the uploaded Excel file')
          )
        }

        reader.readAsBinaryString(file.target.files[0])
      }
    } catch (e) {
      reject(e)
    }
  })
}

export function processJSONFile(file) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      reader.onload = function (e) {
        const converted = e.target.result
        let data = JSON.parse(converted)
        data = data[Object.keys(data)[0]]

        if (data) {
          resolve(JSON.stringify(data))
        } else {
          reject(new Error('There was an error parsing the uploaded JSON file'))
        }
      }

      reader.readAsBinaryString(file.target.files[0])
    } catch (e) {
      reject(e)
    }
  })
}

export function processXMLFile(file) {
  const parser = new Parser()

  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      reader.onload = function (e) {
        const converted = e.target.result
        parser
          .parseStringPromise(converted)
          .then((res) => {
            const keys = Object.keys(res.root)
            let data = res.root[keys[0]]

            data = data.map((d) => {
              const newData = {}
              const k = Object.keys(d)
              k.forEach((k) => {
                newData[nameMapping(k)] = d[k][0]
              })

              return newData
            })

            if (data) {
              resolve(JSON.stringify(data))
            } else {
              reject(
                new Error('There was an error parsing the uploaded XML file')
              )
            }
          })
          .catch((err) => {
            reject(err)
          })
      }

      reader.readAsBinaryString(file.target.files[0])
    } catch (e) {
      reject(e)
    }
  })
}

export function createTableData(data) {
  try {
    const tableData = {}
    return new Promise((resolve, reject) => {
      const uploadedData = JSON.parse(data)
      if (uploadedData.length) {
        const tableKeys = Object.keys(uploadedData[0])
        const headerLabels = tableKeys.map((label) => {
          return { label: label.trim(), options: {} }
        })
        const headers = [...headerLabels]
        tableData.header = headers

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

// eslint-disable-next-line no-empty-pattern
export function fileTypeChecker(fileName) {
  const allowedDocumentExtensions = /(\.json|\.xlsx|\.xls|\.xml)$/i

  if (!allowedDocumentExtensions.exec(fileName)) {
    alert('Unsupported file type selected')
    return false
  } else {
    return fileName.split('.')[1]
  }
}

function nameMapping(name) {
  const index = names.findIndex((n) => {
    return n.includes(name)
  })

  if (index < 0) return name

  return names[index][0]
}
