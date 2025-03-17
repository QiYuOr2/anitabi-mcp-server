export function objectToXML(obj: Record<string, unknown>, rootName = 'root'): string {
  // 递归处理对象或数组
  function parseValue(key: string, value: unknown): string {
    if (typeof value === 'object' && value !== null) {
      // 如果是数组，递归处理每个元素
      if (Array.isArray(value)) {
        return value.map(item => parseValue(key, item)).join('')
      }
      // 如果是对象，递归处理每个属性
      return `<${key}>${objectToXML(value as any)}</${key}>`
    }
    // 如果是普通值，直接返回 XML 节点
    return `<${key}>${value}</${key}>`
  }

  // 处理根对象
  let xml = ''
  for (const [key, value] of Object.entries(obj)) {
    xml += parseValue(key, value)
  }

  // 包裹根节点
  return `<${rootName}>${xml}</${rootName}>`
}
