import { useMemo } from 'react'
import { EnumPullReqReviewDecision, PRCommentFilterType, PullReqReviewDecision, orderSortDate } from './interfaces'

export const processReviewDecision = (
  review_decision: EnumPullReqReviewDecision,
  reviewedSHA?: string,
  sourceSHA?: string
) =>
  review_decision === PullReqReviewDecision.approved && reviewedSHA !== sourceSHA
    ? PullReqReviewDecision.outdated
    : review_decision

export function useActivityFilters() {
  return useMemo(
    () => [
      {
        label: 'Show Everything',
        value: PRCommentFilterType.SHOW_EVERYTHING
      },
      {
        label: 'All comments',
        value: PRCommentFilterType.ALL_COMMENTS
      },
      {
        label: 'My comments/replies',
        value: PRCommentFilterType.MY_COMMENTS
      },
      {
        label: 'Unresolved comments',
        value: PRCommentFilterType.UNRESOLVED_COMMENTS
      },
      {
        label: 'Resolved comments',
        value: PRCommentFilterType.RESOLVED_COMMENTS
      }
    ],
    []
  )
}

export function useDateFilters() {
  return useMemo(
    () => [
      {
        label: 'First added',
        value: orderSortDate.ASC
      },
      {
        label: 'Last added',
        value: orderSortDate.DESC
      }
    ],
    []
  )
}
// The timeDistance function calculates the time difference between two dates (in milliseconds)
//  and returns it in a human-readable format. It can return the difference in days, hours, minutes, and seconds, depending on the onlyHighestDenomination flag.
// ex) const date1 = new Date('2023-10-01T00:00:00').getTime();
// const date2 = new Date('2023-10-02T01:30:45').getTime();
// console.log(timeDistance(date1, date2));
// Output: "1d 1h 30m 45s"
export const timeDistance = (date1 = 0, date2 = 0, onlyHighestDenomination = false) => {
  let distance = Math.abs(date1 - date2)

  if (!distance) {
    return '0s'
  }

  const days = Math.floor(distance / (24 * 3600000))
  if (onlyHighestDenomination && days) {
    return days + 'd'
  }
  distance -= days * 24 * 3600000

  const hours = Math.floor(distance / 3600000)
  if (onlyHighestDenomination && hours) {
    return hours + 'h'
  }
  distance -= hours * 3600000

  const minutes = Math.floor(distance / 60000)
  if (onlyHighestDenomination && minutes) {
    return minutes + 'm'
  }
  distance -= minutes * 60000

  const seconds = Math.floor(distance / 1000)
  if (onlyHighestDenomination) {
    return seconds + 's'
  }

  return `${days ? days + 'd ' : ''}${hours ? hours + 'h ' : ''}${
    minutes ? minutes + 'm' : hours || days ? '0m' : ''
  } ${seconds}s`
}
