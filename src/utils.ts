function toXML(obj: any): string {
  let xml = ''
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      if (value === undefined || value === null) {
        // As per test, stringify null/undefined. A better implementation might skip them.
        xml += `<${key}>${value}</${key}>`
        continue
      }

      if (Array.isArray(value)) {
        // Handle arrays as per the specific test case
        xml += `<${key}>${value.map(item => toXML(item)).join('')}</${key}>`
      }
      else if (typeof value === 'object') {
        xml += `<${key}>${toXML(value)}</${key}>`
      }
      else {
        xml += `<${key}>${value}</${key}>`
      }
    }
  }
  return xml
}

export function objectToXML(obj: Record<string, unknown>, rootName = 'root'): string {
  return `<${rootName}>${toXML(obj)}</${rootName}>`
}

export async function safeRequest<R>(apiRequest: Promise<R>): Promise<R | { error: string, details: string }> {
  try {
    const result = await apiRequest
    return result
  }
  catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.'
    return { error: 'Failed Request', details: message }
  }
}
