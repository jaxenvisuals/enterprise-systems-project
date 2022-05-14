import { Parser } from 'xml2js'
import moment from 'moment'

const names = [
  ['2 Letter Code', '_2_Letter_Code', 'two_letter_code'],
  ['Company Name', 'Company_Name', 'company_name'],
  ['Country', 'country'],
  ['IATA Code', 'IATA_Code', 'iata_code'],
  ['ISO Alpha 3 Code', 'ISO_Alpha_3_Code', 'iso_alpha_3_code'],
  ['Long Name', 'Long_Name', 'long_name'],
  ['Long Location', 'Long_Location', 'long_location'],
  ['Passport Number', 'Passport_Number', 'passport_number'],
  ['Flight Number', 'Flight_Number', 'flight_number'],
  ['Forename', 'forename'],
  ['Family Name', 'Family_Name', 'family_name'],
  ['Gender', 'gender'],
  ['DOB', 'dob'],
  ['Nationality', 'nationality'],
  ['Revenue', 'revenue'],
  ['Seat Number', 'Seat_Number', 'seat_number'],
  ['Aircraft Number', 'Aircraft_Number', 'aircraft_number'],
  ['Passenger Capacity', 'Passenger_Capacity', 'passenger_capacity'],
  ['Crew Capacity', 'Crew_Capacity', 'crew_capacity'],
  ['Aircraft', 'aircraft'],
  ['Departure', 'departure'],
  ['Arrival', 'arrival'],
  ['Terminal', 'terminal'],
  ['Threat ID', 'Threat_ID', 'threat_id'],
  ['Threat Level', 'Threat_Level', 'threat_level'],
  ['Terrorism (50%)', 'Terrorism_50', 'terrorism'],
  ['Smuggling (20%)', 'Smuggling_20', 'smuggling'],
  ['Narcotics (15%)', 'Narcotics_15', 'narcotics'],
  [
    'Illegal Immigration (15%)',
    'Illegal_Immigration_15',
    'illegal_immigration',
  ],
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

        const bodyData = uploadedData.map((row, i) => {
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
            serial: i + 1,
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
    this.$store.commit('pushToast', {
      title: 'Error',
      desc: `Unsupported file type selected`,
      status: 'error',
      errCode: '',
      errMsg: '',
      autoClose: true,
    })
    return false
  } else {
    return fileName.split('.')[1]
  }
}

export function nameMapping(name, reverse = false) {
  const index = names.findIndex((n) => {
    return n.includes(name)
  })

  if (index < 0) return name

  return !reverse ? names[index][0] : names[index][names[index].length - 1]
}

export function refineApiData({ data }) {
  return new Promise((resolve, reject) => {
    try {
      if (!data.length) return []
      const keys = Object.keys(data[0])

      data = data.map((d) => {
        keys.forEach((k) => {
          const mapped = nameMapping(k)
          if (mapped !== k) {
            d[mapped] = d[k]
            delete d[k]
          }
        })

        if (d.DOB) d.DOB = moment().format('DD-MM-YY')

        delete d.created_at
        delete d.deleted_at
        delete d.updated_at
        delete d.id
        return d
      })

      createTableData(JSON.stringify(data))
        .then((data) => {
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (err) {
      reject(err)
    }
  })
}
