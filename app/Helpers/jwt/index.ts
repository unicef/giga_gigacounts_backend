import { Jwt } from 'jsonwebtoken'

import { isString } from './core/is-string'
import { decodeAccessToken } from './core/decode-access-token'
import { validateTokenHeader } from './core/validate-token-header'
import { validateTokenClaims } from './core/validate-token-claims'

/**
 * @packageDocumentation Function to validate access token received from azure active directory.
 * Useful when you're using a msal library to authenticate users on the frontend and you wanna
 * verify Microsoft tokens in the API.
 */

/**
 * The interface represents required fields to process access token validation
 *
 * @public
 */
export interface IValidationOptions {
  /**
   * Only present in v1.0 tokens. The application ID of the client using the token. The application
   * can act as itself or on behalf of a user. The application ID typically represents an application
   * object, but it can also represent a service principal object in Azure AD.
   */
  applicationId: string

  /**
   * Identifies the intended recipient of the token - its audience. In v2.0 tokens, this is always
   * the client ID of the API, while in v1.0 tokens it can be the client ID or the resource URI used
   * in the request, depending on how the client requested the token.
   */
  tenantName: string

  /**
   * Your Microsoft 365 tenant ID is a globally unique identifier (GUID) that is different than your
   * organization name or domain.
   */
  tenantId: string
  /**
   *
   */
  policyName: string
}

/**
 * Validate azure active directory access token
 *
 * @param accessToken - valid access token received from azure
 * @param validationOptions - the interface represents required fields to process access token validation
 *
 * @public
 */
export default async function validate(
  accessToken: string,
  { applicationId, tenantName, tenantId, policyName }: IValidationOptions
): Promise<Jwt> {
  if (tenantId === undefined || tenantId.length === 0) {
    throw new Error('"tenantId" value was not provided')
  }

  if (tenantName === undefined || tenantName.length === 0) {
    throw new Error('"tenantName" value was not provided')
  }

  if (applicationId === undefined || applicationId.length === 0) {
    throw new Error('"applicationId" value was not provided')
  }

  if (policyName === undefined || policyName.length === 0) {
    throw new Error('"policyName" value was not provided')
  }

  const decodedAccessToken = decodeAccessToken(accessToken)

  if (!decodedAccessToken) {
    throw new Error('The access token could not be decoded')
  }

  if (isString(decodedAccessToken.payload)) {
    throw new Error('The access token payload is not an object')
  }

  await validateTokenHeader(decodedAccessToken.header, tenantName, policyName)

  validateTokenClaims(decodedAccessToken.payload, {
    applicationId,
    tenantName,
    tenantId,
    policyName
  })

  return decodedAccessToken
}
