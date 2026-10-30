import * as React from 'react'
import { LanguageDialog } from '@harnessio/ui'

const langs = [{ code: 'en', name: 'English' }, { code: 'fr', name: 'French' }] as any

export function Open() {
  return (
    <LanguageDialog open supportedLanguages={langs} language={'en' as any} onOpenChange={() => {}} onChange={() => {}} onSave={() => {}} onCancel={() => {}} />
  )
}

export function French() {
  return (
    <LanguageDialog open supportedLanguages={langs} language={'fr' as any} onOpenChange={() => {}} onChange={() => {}} onSave={() => {}} onCancel={() => {}} />
  )
}
