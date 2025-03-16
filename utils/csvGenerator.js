import { Parser } from "json2csv"

/**
 * Generate a CSV report
 * @param {Object} data - The report data
 * @returns {Promise<string>} The generated CSV as a string
 */
export const generateCSV = (data) => {
  return new Promise((resolve, reject) => {
    try {
      // Find the first array in the data object to use as CSV data
      let csvData = []
      let fields = []

      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value) && value.length > 0) {
          csvData = value
          fields = Object.keys(value[0])
          break
        }
      }

      if (csvData.length === 0) {
        throw new Error("No data found for CSV export")
      }

      // Format field names
      const transforms = fields.reduce((acc, field) => {
        acc[field] = (value) => {
          if (typeof value === "number") {
            return value.toLocaleString()
          } else if (value instanceof Date) {
            return value.toLocaleDateString()
          } else if (typeof value === "boolean") {
            return value ? "Yes" : "No"
          } else if (value === null || value === undefined) {
            return ""
          }
          return value
        }
        return acc
      }, {})

      // Create CSV parser
      const json2csvParser = new Parser({
        fields,
        transforms,
      })

      // Convert to CSV
      const csv = json2csvParser.parse(csvData)

      resolve(csv)
    } catch (error) {
      reject(error)
    }
  })
}

