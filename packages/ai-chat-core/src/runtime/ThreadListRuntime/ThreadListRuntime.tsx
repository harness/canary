import { CapabilityExecutionManager } from '../../core'
import { StreamAdapter, ThreadListAdapter } from '../../types/adapters'
import { ThreadListItemState } from '../../types/thread'
import { generateThreadId } from '../../utils/idGenerator'
import { BaseSubscribable } from '../../utils/Subscribable'
import { ThreadListItemRuntime } from '../ThreadListItemRuntime/ThreadListItemRuntime'
import { ThreadRuntime } from '../ThreadRuntime/ThreadRuntime'
import { ThreadRuntimeCore } from '../ThreadRuntime/ThreadRuntimeCore'

export interface ThreadListState {
  mainThreadId: string
  threads: readonly string[]
  isLoading: boolean
  threadItems: Record<string, ThreadListItemState>
}

export interface ThreadListRuntimeConfig {
  streamAdapter: StreamAdapter
  threadListAdapter?: ThreadListAdapter
  capabilityExecutionManager?: CapabilityExecutionManager
}

export class ThreadListRuntime extends BaseSubscribable {
  private _mainThreadId: string
  private _threads = new Map<string, ThreadRuntime>()
  private _threadItems = new Map<string, ThreadListItemRuntime>()
  private _threadStates = new Map<string, ThreadListItemState>()
  private _isLoading = false
  public readonly main: ThreadRuntime

  constructor(private config: ThreadListRuntimeConfig) {
    super()

    // Create main thread
    this._mainThreadId = generateThreadId()
    const mainCore = new ThreadRuntimeCore({
      streamAdapter: config.streamAdapter,
      capabilityExecutionManager: config.capabilityExecutionManager
    })
    this.main = new ThreadRuntime(mainCore)
    this._threads.set(this._mainThreadId, this.main)

    // Create main thread state
    const mainState: ThreadListItemState = {
      id: this._mainThreadId,
      title: 'New Chat',
      status: { type: 'regular' },
      isMain: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    this._threadStates.set(this._mainThreadId, mainState)

    // Create main thread item
    const mainItem = new ThreadListItemRuntime({
      state: mainState,
      onSwitchTo: this.switchToThread.bind(this),
      onRename: this.renameThread.bind(this),
      onDelete: this.deleteThread.bind(this)
    })
    this._threadItems.set(this._mainThreadId, mainItem)
  }

  public get isLoading(): boolean {
    return this._isLoading
  }

  /**
   * Get the currently active main thread
   */
  public getMainThread(): ThreadRuntime {
    const mainThread = this._threads.get(this._mainThreadId)
    if (!mainThread) {
      return this.main
    }
    return mainThread
  }

  public getState(): ThreadListState {
    const threads: string[] = []
    const threadItems: Record<string, ThreadListItemState> = {}

    for (const [id, state] of this._threadStates) {
      threadItems[id] = state
      if (state.status.type === 'regular') {
        threads.push(id)
      }
    }

    return {
      mainThreadId: this._mainThreadId,
      threads,
      isLoading: this._isLoading,
      threadItems
    }
  }

  public async switchToThread(threadId: string): Promise<void> {
    const thread = this._threads.get(threadId)
    if (!thread) {
      throw new Error(`Thread ${threadId} not found`)
    }

    // Update old main thread
    const oldMainState = this._threadStates.get(this._mainThreadId)
    if (oldMainState) {
      oldMainState.isMain = false
      this._threadStates.set(this._mainThreadId, oldMainState)
      this._threadItems.get(this._mainThreadId)?.updateState(oldMainState)
    }

    // Update new main thread
    this._mainThreadId = threadId
    const newMainState = this._threadStates.get(threadId)
    if (newMainState) {
      newMainState.isMain = true
      this._threadStates.set(threadId, newMainState)
      this._threadItems.get(threadId)?.updateState(newMainState)
    }

    // Load thread messages if adapter exists
    if (this.config.threadListAdapter && newMainState?.conversationId) {
      this._isLoading = true
      this.notifySubscribers()

      try {
        const messages = await this.config.threadListAdapter.loadThread(threadId)
        thread.reset(messages)
      } catch (error) {
        console.error('Failed to load thread:', error)
      } finally {
        this._isLoading = false
      }
    }

    this.notifySubscribers()
  }

  public async switchToNewThread(): Promise<void> {
    const newThreadId = generateThreadId()
    const newCore = new ThreadRuntimeCore({
      streamAdapter: this.config.streamAdapter,
      capabilityExecutionManager: this.config.capabilityExecutionManager
    })
    const newThread = new ThreadRuntime(newCore)

    this._threads.set(newThreadId, newThread)

    // Create new thread state
    const newState: ThreadListItemState = {
      id: newThreadId,
      title: 'New Chat',
      status: { type: 'regular' },
      isMain: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    this._threadStates.set(newThreadId, newState)

    // Create new thread item
    const newItem = new ThreadListItemRuntime({
      state: newState,
      onSwitchTo: this.switchToThread.bind(this),
      onRename: this.renameThread.bind(this),
      onDelete: this.deleteThread.bind(this)
    })
    this._threadItems.set(newThreadId, newItem)

    // Subscribe to new thread changes
    newThread.subscribe(() => {
      this.notifySubscribers()
    })

    // Create thread via adapter if exists
    if (this.config.threadListAdapter) {
      try {
        const createdState = await this.config.threadListAdapter.createThread()
        newState.conversationId = createdState.conversationId
        this._threadStates.set(newThreadId, newState)
        newItem.updateState(newState)
      } catch (error) {
        console.error('Failed to create thread:', error)
      }
    }

    await this.switchToThread(newThreadId)
  }

  public async loadThreads(): Promise<void> {
    if (!this.config.threadListAdapter) {
      console.warn('No threadListAdapter configured')
      return
    }

    this._isLoading = true
    this.notifySubscribers()

    try {
      const threadStates = await this.config.threadListAdapter.loadThreads()

      for (const state of threadStates) {
        if (this._threadStates.has(state.id)) {
          continue
        }

        const threadCore = new ThreadRuntimeCore({
          streamAdapter: this.config.streamAdapter
        })
        const thread = new ThreadRuntime(threadCore)
        this._threads.set(state.id, thread)

        this._threadStates.set(state.id, state)

        // Create thread item
        const threadItem = new ThreadListItemRuntime({
          state,
          onSwitchTo: this.switchToThread.bind(this),
          onRename: this.renameThread.bind(this),
          onDelete: this.deleteThread.bind(this)
        })
        this._threadItems.set(state.id, threadItem)

        // Subscribe to thread changes
        thread.subscribe(() => {
          this.notifySubscribers()
        })
      }
    } catch (error) {
      console.error('Failed to load threads:', error)
    } finally {
      this._isLoading = false
      this.notifySubscribers()
    }
  }

  private async renameThread(threadId: string, newTitle: string): Promise<void> {
    const state = this._threadStates.get(threadId)
    if (!state) return

    state.title = newTitle
    state.updatedAt = Date.now()
    this._threadStates.set(threadId, state)
    this._threadItems.get(threadId)?.updateState(state)

    if (this.config.threadListAdapter) {
      try {
        await this.config.threadListAdapter.updateThread(threadId, { title: newTitle })
      } catch (error) {
        console.error('Failed to rename thread:', error)
      }
    }

    this.notifySubscribers()
  }

  private async deleteThread(threadId: string): Promise<void> {
    if (threadId === this._mainThreadId && this._threads.size === 1) {
      throw new Error('Cannot delete the last thread')
    }

    // If deleting main thread, switch to another thread first
    if (threadId === this._mainThreadId) {
      const otherThreadId = Array.from(this._threads.keys()).find(id => id !== threadId)
      if (otherThreadId) {
        await this.switchToThread(otherThreadId)
      }
    }

    this._threads.delete(threadId)
    this._threadItems.delete(threadId)
    this._threadStates.delete(threadId)

    if (this.config.threadListAdapter) {
      try {
        await this.config.threadListAdapter.deleteThread(threadId)
      } catch (error) {
        console.error('Failed to delete thread:', error)
      }
    }

    this.notifySubscribers()
  }
}
