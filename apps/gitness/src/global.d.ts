declare module 'monaco-editor/esm/vs/editor/common/services/languageFeatures.js' {
  export const ILanguageFeaturesService: { documentSymbolProvider: unknown }
}

declare module 'monaco-editor/esm/vs/editor/contrib/documentSymbols/browser/outlineModel.js' {
  import type { editor, languages } from 'monaco-editor'

  export abstract class OutlineModel {
    static create(registry: unknown, model: editor.ITextModel): Promise<OutlineModel>

    asListOfDocumentSymbols(): languages.DocumentSymbol[]
  }
}

declare module 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices.js' {
  export const StandaloneServices: {
    get: (id: unknown) => { documentSymbolProvider: unknown }
  }
}

declare interface Window {
  apiUrl?: string
}

declare module 'lang-map' {
  const languages: { languages: (name: string) => string[] }
  export default languages
}

declare module '@harnessio/react-ng-manager-v2-client/dist/custom-fetcher/index.js' {
  export interface FetcherOptions<TQueryParams = never, TBody = never, THeaderParams = HeadersInit>
    extends Omit<RequestInit, 'body' | 'headers'> {
    url: string
    queryParams?: TQueryParams extends never ? undefined : TQueryParams
    body?: TBody extends never ? undefined : TBody
    headers?: THeaderParams
  }

  interface ResponseContainer<T> {
    body: T
    headers: Headers
  }

  export function fetcher<TResponse = unknown, TQueryParams = never, TBody = never, THeaderParams = HeadersInit>(
    options: FetcherOptions<TQueryParams, TBody, THeaderParams>
  ): Promise<ResponseContainer<TResponse>>
}
