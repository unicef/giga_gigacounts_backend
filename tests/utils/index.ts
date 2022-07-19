import fs from 'fs/promises'

const toBase64 = async (data: string, filePath: string) => {
  const base64 = await fs.readFile(filePath, { encoding: 'base64' })
  return `${data}${base64}`
}

export default {
  toBase64,
}
