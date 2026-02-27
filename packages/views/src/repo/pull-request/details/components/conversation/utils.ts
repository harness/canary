/**
 * Pull Request comment utilities.
 *
 * Generic textarea utilities (getCaretPosition, getCurrentWord, replaceWord, getCaretCoordinates)
 * are available from '@harnessio/ui/utils'.
 */

import { isEmpty } from 'lodash-es'

import { PrincipalsMentionMap } from '../../pull-request-details-types'

/**
 * ==================================
 * COMMENT AND USER MAPPING FUNCTIONS
 * ==================================
 */

export const replaceMentionIdWithEmail = (input: string, mentionsMap: PrincipalsMentionMap) =>
  input.replace(/@\[(\d+)\]/g, (match, id) => (mentionsMap[id] ? `@[${mentionsMap[id].email}]` : match))

/**
 * Replaces all mentions of the form @[\S+@\S+\.\S+] with the id from the emailMap.
 * If the email is not found in the emailMap, the original mention is left unchanged.
 * @param input The string that contains the mentions to be replaced.
 * @param emailMap A map of email to TypesPrincipalInfo.
 * @returns A string with all mentions replaced with their corresponding id.
 */
export const replaceMentionEmailWithId = (input: string, emailMap: PrincipalsMentionMap) =>
  input.replace(/@\[(\S+@\S+\.\S+)\]/g, (match, email) => (emailMap[email] ? `@[${emailMap[email].id}]` : match))

export const replaceMentionEmailWithDisplayName = (input: string, emailMap: PrincipalsMentionMap) =>
  input.replace(/@\[(\S+@\S+\.\S+)\]/g, (match, email) =>
    emailMap[email] ? `[@${emailMap[email].display_name}](mailto:${emailMap[email].email})` : match
  )

export const replaceMentionIdWithDisplayName = (input: string, mentionsMap: PrincipalsMentionMap) =>
  input.replace(/@\[(\d+)\]/g, (match, id) => {
    try {
      const principal = mentionsMap?.[id]
      if (principal && principal.display_name && principal.email) {
        return `[@${principal.display_name}](mailto:${principal.email})`
      }
      return match
    } catch (error) {
      console.warn('Error accessing mentionsMap:', error)
      return match
    }
  })

/**
 * Transforms an object to use email property values as keys
 * @param {Object} data - The original object with numeric keys
 * @returns {Object} - New object with email addresses as keys
 */
export const replaceEmailAsKey = (data: PrincipalsMentionMap): PrincipalsMentionMap => {
  if (isEmpty(data)) return {}

  const result: PrincipalsMentionMap = {}

  // Iterate through each entry in the original object
  Object.values(data).forEach(user => {
    if (user.email) {
      // Use email as the new key, keeping all original properties
      result[user.email] = user
    }
  })

  return result
}
