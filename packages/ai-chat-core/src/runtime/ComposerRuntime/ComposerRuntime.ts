import { BaseSubscribable } from '../../utils/Subscribable'

export interface ComposerState {
  text: string
  isSubmitting: boolean
}

export class ComposerRuntime extends BaseSubscribable {
  private _text: string = ''
  private _isSubmitting: boolean = false

  public get text(): string {
    return this._text
  }

  public get isSubmitting(): boolean {
    return this._isSubmitting
  }

  public getState(): ComposerState {
    return {
      text: this._text,
      isSubmitting: this._isSubmitting
    }
  }

  public setText(text: string): void {
    this._text = text
    this.notifySubscribers()
  }

  public clear(): void {
    this._text = ''
    this.notifySubscribers()
  }

  public setSubmitting(isSubmitting: boolean): void {
    this._isSubmitting = isSubmitting
    this.notifySubscribers()
  }
}

export default ComposerRuntime
