import { FilterValue } from '@components/filters/types'

import { WebhookType } from '../../webhooks/webhook-list/types'

/**
 * Filters webhooks based on active filters
 */
export const filterWebhooks = (webhooks: WebhookType[] | null, activeFilters: FilterValue[]): WebhookType[] => {
  if (!webhooks) return []
  if (activeFilters.length === 0) return webhooks

  return webhooks.filter(webhook => activeFilters.every(filter => applyFilter(webhook, filter)))
}

const applyFilter = (webhook: WebhookType, filter: FilterValue): boolean => {
  switch (filter.type) {
    case 'type':
      return applyTypeFilter(webhook, filter)
    case 'created_time':
      return applyDateFilter(webhook, filter)
    case 'name':
      return applyNameFilter(webhook, filter)
    default:
      return true
  }
}

/**
 * Applies type-based filtering (enabled/disabled)
 */
const applyTypeFilter = (webhook: WebhookType, filter: FilterValue): boolean => {
  if (filter.condition === 'is_empty' || filter.condition === 'is_not_empty') {
    return true
  }

  if (filter.selectedValues.length === 0) {
    return true
  }

  const isEnabled = webhook.enabled
  const isDisabled = !webhook.enabled

  const matchesType = filter.selectedValues.some(value => {
    switch (value) {
      case 'enabled':
        return isEnabled
      case 'disabled':
        return isDisabled
      default:
        return false
    }
  })

  return filter.condition === 'is' ? matchesType : !matchesType
}

/**
 * Applies date-based filtering
 */
const applyDateFilter = (webhook: WebhookType, filter: FilterValue): boolean => {
  if (filter.selectedValues.length === 0) {
    return true
  }

  if (filter.condition === 'is_empty') {
    return !webhook.updated
  }
  if (filter.condition === 'is_not_empty') {
    return !!webhook.updated
  }

  const createdDate = new Date(webhook.updated)
  const selectedDate = new Date(filter.selectedValues[0])

  createdDate.setHours(0, 0, 0, 0)
  selectedDate.setHours(0, 0, 0, 0)

  switch (filter.condition) {
    case 'is':
      return createdDate.getTime() === selectedDate.getTime()
    case 'is_before':
      return createdDate.getTime() < selectedDate.getTime()
    case 'is_after':
      return createdDate.getTime() > selectedDate.getTime()
    case 'is_between': {
      if (filter.selectedValues.length !== 2) return true
      const endDate = new Date(filter.selectedValues[1])
      endDate.setHours(0, 0, 0, 0)
      return createdDate.getTime() >= selectedDate.getTime() && createdDate.getTime() <= endDate.getTime()
    }
    default:
      return true
  }
}

/**
 * Applies name-based filtering
 */
const applyNameFilter = (webhook: WebhookType, filter: FilterValue): boolean => {
  if (filter.condition === 'is_empty') {
    return !webhook.name
  }
  if (filter.condition === 'is_not_empty') {
    return !!webhook.name
  }

  if (filter.selectedValues.length === 0) {
    return true
  }

  const value = filter.selectedValues[0].toLowerCase()
  const name = webhook.name.toLowerCase()

  switch (filter.condition) {
    case 'is':
      return name === value
    case 'is_not':
      return name !== value
    case 'contains':
      return name.includes(value)
    case 'does_not_contain':
      return !name.includes(value)
    case 'starts_with':
      return name.startsWith(value)
    case 'ends_with':
      return name.endsWith(value)
    default:
      return true
  }
}
