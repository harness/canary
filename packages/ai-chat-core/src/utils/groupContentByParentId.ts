import { MessageContent } from '../types/message'

export interface ContentGroup {
  groupKey: string | undefined
  indices: number[]
  items: MessageContent[]
  groupType: 'code' | 'tool-calls' | 'reasoning' | 'mixed' | 'single-type'
  primaryType: string
}

export function groupContentByParentId(content: MessageContent[]): ContentGroup[] {
  const groupMap = new Map<string, number[]>()

  // Group by parentId
  for (let i = 0; i < content.length; i++) {
    const item = content[i]
    const parentId = item.parentId
    const groupId = parentId ?? `__ungrouped_${i}`

    const indices = groupMap.get(groupId) ?? []
    indices.push(i)
    groupMap.set(groupId, indices)
  }

  // Convert to groups with type detection
  const groups: ContentGroup[] = []
  for (const [groupId, indices] of groupMap) {
    const groupKey = groupId.startsWith('__ungrouped_') ? undefined : groupId
    const items = indices.map(i => content[i])
    const groupType = detectGroupType(items)
    const primaryType = getPrimaryType(items)

    groups.push({ groupKey, indices, items, groupType, primaryType })
  }

  return groups
}

function detectGroupType(items: MessageContent[]): ContentGroup['groupType'] {
  if (items.length === 1) return 'single-type'

  const types = new Set(items.map(item => item.type))

  // All same type
  if (types.size === 1) {
    const type = items[0].type

    if (type === 'tool_call') {
      return 'tool-calls'
    }

    if (type === 'assistant_thought') {
      return 'reasoning'
    }

    return 'single-type'
  }

  // Mixed types
  return 'mixed'
}

function getPrimaryType(items: MessageContent[]): string {
  const typeCounts = new Map<string, number>()

  for (const item of items) {
    typeCounts.set(item.type, (typeCounts.get(item.type) || 0) + 1)
  }

  let maxCount = 0
  let primaryType = items[0].type

  for (const [type, count] of typeCounts) {
    if (count > maxCount) {
      maxCount = count
      primaryType = type
    }
  }

  return primaryType
}
