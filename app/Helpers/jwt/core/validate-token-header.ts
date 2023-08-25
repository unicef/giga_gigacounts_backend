import axios from 'axios'
import { JwtHeader } from 'jsonwebtoken'

import { objectStorageFactory } from './object-storage-factory'
import { axiosTryCatchWrapper } from './axios-try-catch-wrapper'

interface IDiscoveryKeysData {
  keys: [{ kid: string }]
}

const objectStorage = objectStorageFactory()

const getDiscoveryKeysApiUrl = (tenantName: string, policyName: string) =>
  `https://${tenantName}.b2clogin.com/${tenantName}.onmicrosoft.com/${policyName}/discovery/v2.0/keys`

async function callDiscoveryKeysApi(tenantName: string, policyName: string) {
  const discoveryKeysApiUrl = getDiscoveryKeysApiUrl(tenantName, policyName)

  return axios.get<IDiscoveryKeysData>(discoveryKeysApiUrl)
}

export async function validateTokenHeader(
  tokenHeader: JwtHeader,
  tenantName: string,
  policyName: string
): Promise<void> {
  if (!tokenHeader.kid) {
    throw new Error('Token header does not contain "kid" property')
  }

  if (objectStorage.getItem(tokenHeader.kid)) {
    return
  }

  const { data } = await axiosTryCatchWrapper(
    () => callDiscoveryKeysApi(tenantName, policyName),
    'Discovery Keys API throws an error'
  )

  const isValidPublicKey = data.keys.some((_key) => _key.kid === tokenHeader.kid)

  if (!isValidPublicKey) {
    throw new Error('The public key retrieved from the token header is invalid')
  }

  objectStorage.setItem(tokenHeader.kid, 'valid')
}
