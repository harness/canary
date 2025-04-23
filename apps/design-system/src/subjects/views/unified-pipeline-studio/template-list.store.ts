import { useEffect, useState } from 'react'

import { ITemplateListItem, ITemplateListStore } from '@harnessio/ui/views'

import { templateStepForm } from './mocks/template-step-form'

export const useTemplateListStore = (): ITemplateListStore => {
  const [templates, setTemplates] = useState<ITemplateListItem[] | null>([])
  const [totalPages, setTotalPages] = useState(1)

  const setTemplatesData = (templates: ITemplateListItem[] | null, pagesCount: number) => {
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
          version: '1.0.0',
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
