import { ThreadListItemState } from '../../types/thread'
import { BaseSubscribable, Unsubscribe } from '../../utils/Subscribable'

export interface ThreadListItemRuntimeConfig {
  state: ThreadListItemState
  onSwitchTo: (threadId: string) => Promise<void>
  onRename: (threadId: string, title: string) => Promise<void>
  onDelete: (threadId: string) => Promise<void>
}

export class ThreadListItemRuntime extends BaseSubscribable {
  private _state: ThreadListItemState

  constructor(private config: ThreadListItemRuntimeConfig) {
    super()
    this._state = config.state
  }

  public get state(): ThreadListItemState {
    return this._state
  }

  public getState(): ThreadListItemState {
    return this._state
  }

  public updateState(state: ThreadListItemState): void {
    this._state = state
    this.notifySubscribers()
  }

  public async switchTo(): Promise<void> {
    await this.config.onSwitchTo(this._state.id)
  }

  public async rename(newTitle: string): Promise<void> {
    await this.config.onRename(this._state.id, newTitle)
  }

  public async delete(): Promise<void> {
    await this.config.onDelete(this._state.id)
  }

  public subscribe(callback: () => void): Unsubscribe {
    return super.subscribe(callback)
  }
}
