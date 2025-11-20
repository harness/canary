export type Unsubscribe = () => void

export abstract class BaseSubscribable {
  private _subscriptions = new Set<() => void>()

  public subscribe(callback: () => void): Unsubscribe {
    this._subscriptions.add(callback)
    return () => {
      this._subscriptions.delete(callback)
    }
  }

  protected notifySubscribers(): void {
    for (const callback of this._subscriptions) {
      callback()
    }
  }

  protected getSubscriberCount(): number {
    return this._subscriptions.size
  }
}
