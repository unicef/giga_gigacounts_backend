import { BlobServiceClient } from '@azure/storage-blob'
import { DateTime } from 'luxon'
import { v1 } from 'uuid'

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || ''
const containerName = `${process.env.AZURE_CONTAINER_NAME}`

const uploadFile = async (file: string): Promise<string> => {
  const blobClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING)
  const container = blobClient.getContainerClient(containerName)
  const matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/) || []
  const type = getFileType(matches[1])
  const fileName = createFileName(type)
  const buffer = Buffer.from(matches[2], 'base64')
  const blockBlobClient = container.getBlockBlobClient(fileName)
  await blockBlobClient.uploadData(buffer)
  return blockBlobClient.url
}

const createFileName = (fileExtension: string) =>
  `${v1()}-${DateTime.now().toMillis()}.${fileExtension}`

const getFileType = (str: string) => str.substring(str.indexOf('/') + 1)

export default {
  uploadFile,
}
