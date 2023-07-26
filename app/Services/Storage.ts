import {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  StorageSharedKeyCredential
} from '@azure/storage-blob'
import { DateTime } from 'luxon'
import { v1 } from 'uuid'

import EntityTooLargeException from 'App/Exceptions/EntityTooLargeException'

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || ''
const containerName = `${process.env.AZURE_CONTAINER_NAME}`

const limitInBytes = 20971520 // 20 mb

const getAccountName = () =>
  AZURE_STORAGE_CONNECTION_STRING.split('AccountName=').pop()?.split(';')[0] || ''

const getAccountKey = () =>
  AZURE_STORAGE_CONNECTION_STRING.split('AccountKey=').pop()?.split(';')[0] || ''

const uploadFile = async (file: string): Promise<string> => {
  const matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/) || []
  checkFileSize(matches[2])
  const blobClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING)
  const container = blobClient.getContainerClient(containerName)
  const type = getFileType(matches[1])
  const fileName = createFileName(type)
  const buffer = Buffer.from(matches[2], 'base64')
  const blockBlobClient = container.getBlockBlobClient(fileName)
  await blockBlobClient.uploadData(buffer)
  return blockBlobClient.url
}

const generateSasToken = (url: string) => {
  const blobName = getBlobName(url)
  const cerds = new StorageSharedKeyCredential(getAccountName(), getAccountKey())
  const blobSAS = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse('racwd'),
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 86400)
    },
    cerds
  ).toString()
  return `${url}?${blobSAS}`
}

const deleteFile = async (url: string) => {
  const blobName = getBlobName(url)
  const blobClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING)
  const container = blobClient.getContainerClient(containerName)
  const blockBlobClient = container.getBlockBlobClient(blobName)
  return blockBlobClient.deleteIfExists()
}

const getBlobName = (url: string) => url.substring(url.lastIndexOf('/') + 1)

const createFileName = (fileExtension: string) =>
  `${v1()}-${DateTime.now().toMillis()}.${fileExtension}`

const getFileType = (str: string) => str.substring(str.indexOf('/') + 1)

const checkFileSize = (base64: string) => {
  let y = 1
  if (base64.slice(-2) === '==') y = 2
  const sizeInBytes = base64.length * (3 / 4) - y
  if (sizeInBytes > limitInBytes) {
    throw new EntityTooLargeException('request entity too large', 413, 'E_REQUEST_ENTITY_TOO_LARGE')
  }
}

export default {
  uploadFile,
  generateSasToken,
  deleteFile
}
