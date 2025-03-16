/**
 * Performance monitoring utility
 */
export const performanceMonitor = {
  /**
   * Start measuring performance
   * @param label - Performance measurement label
   */
  start(label: string): void {
    if (typeof window !== "undefined" && window.performance) {
      window.performance.mark(`${label}-start`)
    }
  },

  /**
   * End measuring performance and log the result
   * @param label - Performance measurement label
   * @returns Performance measurement in milliseconds
   */
  end(label: string): number | null {
    if (typeof window !== "undefined" && window.performance) {
      window.performance.mark(`${label}-end`)

      window.performance.measure(label, `${label}-start`, `${label}-end`)

      const measure = window.performance.getEntriesByName(label, "measure")[0]
      const duration = measure.duration

      // Clean up marks and measures
      window.performance.clearMarks(`${label}-start`)
      window.performance.clearMarks(`${label}-end`)
      window.performance.clearMeasures(label)

      // Log performance in development
      if (process.env.NODE_ENV === "development") {
        console.log(`⚡️ ${label}: ${duration.toFixed(2)}ms`)
      }

      return duration
    }

    return null
  },

  /**
   * Measure the performance of a function
   * @param label - Performance measurement label
   * @param fn - Function to measure
   * @returns Function result
   */
  measure<T>(label: string, fn: () => T): T {
    this.start(label)
    const result = fn()
    this.end(label)
    return result
  },

  /**
   * Measure the performance of an async function
   * @param label - Performance measurement label
   * @param fn - Async function to measure
   * @returns Promise with function result
   */
  async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label)
    const result = await fn()
    this.end(label)
    return result
  },
}

