import PDFDocument from "pdfkit"

/**
 * Generate a PDF report
 * @param {string} title - The report title
 * @param {Object} data - The report data
 * @param {Date} startDate - The start date of the report period
 * @param {Date} endDate - The end date of the report period
 * @returns {Promise<Buffer>} The generated PDF as a buffer
 */
export const generatePDF = (title, data, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document
      const doc = new PDFDocument({ margin: 50 })

      // Buffer to store PDF data
      const buffers = []
      doc.on("data", buffers.push.bind(buffers))
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers)
        resolve(pdfData)
      })

      // Add report header
      doc.fontSize(25).text(title, { align: "center" })
      doc.moveDown()
      doc.fontSize(12).text(`Report Period: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`, {
        align: "center",
      })
      doc.moveDown()
      doc.moveDown()

      // Add report content based on data structure
      // This is a simplified implementation - in a real application, you would
      // format the content based on the specific report type and data structure

      // Add summary section
      if (data.summary) {
        doc.fontSize(16).text("Summary", { underline: true })
        doc.moveDown()

        Object.entries(data.summary).forEach(([key, value]) => {
          const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
          doc.fontSize(12).text(`${formattedKey}: ${value}`)
        })

        doc.moveDown()
      }

      // Add tables for different data sections
      Object.entries(data).forEach(([sectionKey, sectionData]) => {
        if (sectionKey === "summary") return // Already handled

        if (Array.isArray(sectionData) && sectionData.length > 0) {
          const formattedSectionKey = sectionKey.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
          doc.fontSize(16).text(formattedSectionKey, { underline: true })
          doc.moveDown()

          // Create table header
          const columns = Object.keys(sectionData[0])
          const columnWidths = {}
          const pageWidth = doc.page.width - 100 // Margins on both sides

          // Calculate column widths
          columns.forEach((col) => {
            columnWidths[col] = pageWidth / columns.length
          })

          // Draw table header
          let xPos = 50
          columns.forEach((col) => {
            const formattedCol = col.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
            doc.fontSize(10).text(formattedCol, xPos, doc.y, { width: columnWidths[col], align: "left" })
            xPos += columnWidths[col]
          })

          doc.moveDown()

          // Draw horizontal line
          doc
            .moveTo(50, doc.y)
            .lineTo(doc.page.width - 50, doc.y)
            .stroke()
          doc.moveDown()

          // Draw table rows
          sectionData.forEach((row, rowIndex) => {
            // Check if we need a new page
            if (doc.y > doc.page.height - 100) {
              doc.addPage()
            }

            xPos = 50
            columns.forEach((col) => {
              let value = row[col]

              // Format value based on type
              if (typeof value === "number") {
                value = value.toLocaleString()
              } else if (value instanceof Date) {
                value = value.toLocaleDateString()
              } else if (typeof value === "boolean") {
                value = value ? "Yes" : "No"
              } else if (value === null || value === undefined) {
                value = "-"
              }

              doc.fontSize(10).text(value, xPos, doc.y, { width: columnWidths[col], align: "left" })
              xPos += columnWidths[col]
            })

            doc.moveDown()

            // Add a light gray background for alternate rows
            if (rowIndex % 2 === 1) {
              doc.rect(50, doc.y - 15, pageWidth, 15).fill("#f5f5f5")
            }
          })

          doc.moveDown()
          doc.moveDown()
        }
      })

      // Add footer with page numbers
      const totalPages = doc.bufferedPageRange().count
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i)
        doc.fontSize(8).text(`Page ${i + 1} of ${totalPages}`, 50, doc.page.height - 50, {
          align: "center",
          width: doc.page.width - 100,
        })
      }

      // Finalize the PDF
      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

