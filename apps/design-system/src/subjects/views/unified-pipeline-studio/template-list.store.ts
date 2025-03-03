import { useEffect, useState } from 'react'

import { ITemplateListStore } from '@harnessio/ui/views'

import { templateStepForm } from './mocks/template-step-form'

export const useTemplateListStore = (): ITemplateListStore => {
  const [templates, setTemplates] = useState<{ identifier: string; description?: string }[] | null>([])
  const [totalPages, setTotalPages] = useState(1)

  const setTemplatesData = (templates: { identifier: string; description?: string }[] | null, pagesCount: number) => {
    setTemplates(templates)
    setTotalPages(pagesCount)
  }

  const [page, setPage] = useState(1)

  useEffect(() => {
    const items = Array(10)
      .fill({})
      .map((_, index) => {
        const itemIdx = index + 10 * (page - 1)
        return {
          identifier: `template-${itemIdx}`,
          description: `Description for template ${itemIdx}`
        }
      })

    setTemplates(items)
  }, [page])

  return {
    page,
    getTemplateFormDefinition: (_identifier: string) => Promise.resolve(templateStepForm),
    setPage,
    setTemplatesData,
    templates,
    totalPages,
    xNextPage: page + 1,
    xPrevPage: page - 1
  }
}
