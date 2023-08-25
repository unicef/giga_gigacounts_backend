import { JwtPayload } from 'jsonwebtoken'

import { IValidationOptions } from '..'

export function validateTokenClaims(
  tokenPayload: JwtPayload,
  { applicationId, tenantId, policyName, tenantName }: IValidationOptions
): void {
  // policy name
  if (!tokenPayload.acr) {
    throw new Error('The token\'s payload does not contain "acr" property')
  }

  const isValidPolicyName = tokenPayload.acr.toLowerCase() === policyName.toLowerCase()

  if (!isValidPolicyName) {
    throw new Error('The token\'s payload contains different policy name')
  }

  // applicationId
  if (!tokenPayload.aud) {
    throw new Error('The token\'s payload does not contain "aud" property')
  }

  const isValidAudience = tokenPayload.aud === applicationId

  if (!isValidAudience) {
    throw new Error('The token\'s payload contains different audience')
  }

  // security token service
  if (!tokenPayload.iss) {
    throw new Error('The token\'s payload does not contain "iss" property')
  }

  const isValidSecurityTokenService =
    tokenPayload.iss.includes(tenantName) && tokenPayload.iss.includes(tenantId)

  if (!isValidSecurityTokenService) {
    throw new Error('The token\'s payload contains different security token service')
  }

  // expiration
  if (!tokenPayload.exp) {
    throw new Error('The token\'s payload does not contain "exp" property')
  }

  if (typeof tokenPayload.exp !== 'number') {
    throw new Error('The token\'s payload expiration is not a number value')
  }

  const isValidExpiration = tokenPayload.exp > Math.floor(Date.now() / 1000)

  if (!isValidExpiration) {
    throw new Error('Token has expired')
  }
}
