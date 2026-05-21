import type { QuickAction, QuickActionConfig, QuickActionFilter, QuickActionScopeMode } from '../types/quick-action'

interface QuickActionEntry {
  config: QuickActionConfig
  priority: number
}

interface ScopeInfo {
  mode: QuickActionScopeMode
  actions: Map<string, QuickActionEntry>
}

export class QuickActionRegistry {
  private scopes = new Map<string, ScopeInfo>()
  private scopeStack: string[] = []

  constructor() {
    // Initialize global scope
    this.scopes.set('global', {
      mode: 'merge',
      actions: new Map()
    })
    this.scopeStack.push('global')
  }

  /**
   * Activate a scope with the specified mode.
   * This pushes the scope onto the stack, making it active.
   */
  public activateScope(scope: string, mode: QuickActionScopeMode = 'merge'): void {
    // Create scope if it doesn't exist
    if (!this.scopes.has(scope)) {
      this.scopes.set(scope, {
        mode,
        actions: new Map()
      })
    } else {
      // Update mode if scope already exists
      const scopeInfo = this.scopes.get(scope)!
      scopeInfo.mode = mode
    }

    // Add to stack if not already present
    if (!this.scopeStack.includes(scope)) {
      this.scopeStack.push(scope)
    }
  }

  /**
   * Deactivate a scope, removing it from the stack.
   * This restores the previous scope as active.
   */
  public deactivateScope(scope: string): void {
    const index = this.scopeStack.indexOf(scope)
    if (index !== -1 && scope !== 'global') {
      this.scopeStack.splice(index, 1)
    }
  }

  /**
   * Get the currently active scope (top of stack).
   */
  public getActiveScope(): string {
    return this.scopeStack[this.scopeStack.length - 1] || 'global'
  }

  /**
   * Get the full scope stack.
   */
  public getScopeStack(): string[] {
    return [...this.scopeStack]
  }

  /**
   * Register a quick action in the specified scope.
   */
  public register(config: QuickActionConfig, scope: string = 'global'): void {
    const priority = config.priority ?? 0

    // Ensure scope exists
    if (!this.scopes.has(scope)) {
      this.scopes.set(scope, {
        mode: 'merge',
        actions: new Map()
      })
    }

    const scopeInfo = this.scopes.get(scope)!

    if (scopeInfo.actions.has(config.id)) {
      console.warn(`QuickAction with id "${config.id}" is already registered in scope "${scope}". Overwriting.`)
    }

    scopeInfo.actions.set(config.id, {
      config,
      priority
    })
  }

  /**
   * Unregister a quick action from the specified scope.
   */
  public unregister(id: string, scope: string = 'global'): boolean {
    const scopeInfo = this.scopes.get(scope)
    if (!scopeInfo) {
      return false
    }

    return scopeInfo.actions.delete(id)
  }

  /**
   * Clear all actions in the specified scope.
   */
  public clearScope(scope: string): void {
    const scopeInfo = this.scopes.get(scope)
    if (scopeInfo) {
      scopeInfo.actions.clear()
    }
  }

  /**
   * Get all visible quick actions based on the active scope and its mode.
   */
  public async getVisible(filter?: QuickActionFilter): Promise<QuickAction[]> {
    const activeScope = this.getActiveScope()
    const activeScopeInfo = this.scopes.get(activeScope)

    if (!activeScopeInfo) {
      return []
    }

    const mode = activeScopeInfo.mode
    let entries: QuickActionEntry[] = []

    // Determine which scopes to include based on mode
    if (mode === 'replace') {
      // Only show actions from the active scope
      entries = Array.from(activeScopeInfo.actions.values())
    } else if (mode === 'append') {
      // Show actions from all scopes in the stack
      for (const scope of this.scopeStack) {
        const scopeInfo = this.scopes.get(scope)
        if (scopeInfo) {
          entries.push(...Array.from(scopeInfo.actions.values()))
        }
      }
    } else {
      // mode === 'merge' (default)
      // Show global + active scope
      const globalInfo = this.scopes.get('global')
      if (globalInfo) {
        entries.push(...Array.from(globalInfo.actions.values()))
      }
      if (activeScope !== 'global') {
        entries.push(...Array.from(activeScopeInfo.actions.values()))
      }
    }

    // Evaluate conditions in parallel
    const results = await Promise.all(
      entries.map(async entry => {
        if (!entry.config.condition) {
          return { entry, visible: true }
        }
        try {
          const visible = await entry.config.condition()
          return { entry, visible }
        } catch (error) {
          console.error(`Error evaluating condition for quick action "${entry.config.id}":`, error)
          return { entry, visible: false }
        }
      })
    )

    // Filter visible actions
    let visibleEntries = results.filter(r => r.visible).map(r => r.entry)

    // Sort by priority (highest first)
    visibleEntries.sort((a, b) => b.priority - a.priority)

    // Apply scope filter if specified
    if (filter?.scope) {
      visibleEntries = visibleEntries.filter(e => e.config.scope === filter.scope)
    }

    // Map to QuickAction (omitting condition function)
    return visibleEntries.map(entry => ({
      id: entry.config.id,
      label: entry.config.label,
      prompt: entry.config.prompt,
      icon: entry.config.icon,
      description: entry.config.description,
      priority: entry.config.priority,
      scope: entry.config.scope
    }))
  }

  /**
   * Get a single quick action by ID from the specified scope.
   */
  public get(id: string, scope: string = 'global'): QuickAction | undefined {
    const scopeInfo = this.scopes.get(scope)
    if (!scopeInfo) {
      return undefined
    }

    const entry = scopeInfo.actions.get(id)
    if (!entry) {
      return undefined
    }

    return {
      id: entry.config.id,
      label: entry.config.label,
      prompt: entry.config.prompt,
      icon: entry.config.icon,
      description: entry.config.description,
      priority: entry.config.priority,
      scope: entry.config.scope
    }
  }

  /**
   * Check if a quick action exists in the specified scope.
   */
  public has(id: string, scope: string = 'global'): boolean {
    const scopeInfo = this.scopes.get(scope)
    return scopeInfo ? scopeInfo.actions.has(id) : false
  }
}
