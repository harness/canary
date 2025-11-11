import {
  PermissionIdentifier,
  RbacButtonProps,
  RbacMoreActionsTooltipActionData,
  RbacMoreActionsTooltipProps,
  RBACProps,
  RbacSplitButtonProps,
  RBACSplitProps,
  rbacTooltip,
  Resource,
  ResourceType
} from '../types'

describe('RBAC Types', () => {
  describe('ResourceType Enum', () => {
    test('should have CODE_REPOSITORY value', () => {
      expect(ResourceType.CODE_REPOSITORY).toBe('CODE_REPOSITORY')
    })

    test('should have SECRET value', () => {
      expect(ResourceType.SECRET).toBe('SECRET')
    })

    test('should have all expected enum values', () => {
      const expectedValues = ['CODE_REPOSITORY', 'SECRET']
      const actualValues = Object.values(ResourceType)
      expect(actualValues).toEqual(expect.arrayContaining(expectedValues))
      expect(actualValues.length).toBe(expectedValues.length)
    })
  })

  describe('PermissionIdentifier Enum', () => {
    test('should have CODE_REPO_CREATE value', () => {
      expect(PermissionIdentifier.CODE_REPO_CREATE).toBe('code_repo_create')
    })

    test('should have CODE_REPO_DELETE value', () => {
      expect(PermissionIdentifier.CODE_REPO_DELETE).toBe('code_repo_delete')
    })

    test('should have UPDATE_SECRET value', () => {
      expect(PermissionIdentifier.UPDATE_SECRET).toBe('core_secret_edit')
    })

    test('should have DELETE_SECRET value', () => {
      expect(PermissionIdentifier.DELETE_SECRET).toBe('core_secret_delete')
    })

    test('should have all expected enum values', () => {
      const expectedValues = ['code_repo_create', 'code_repo_delete', 'core_secret_edit', 'core_secret_delete']
      const actualValues = Object.values(PermissionIdentifier)
      expect(actualValues).toEqual(expect.arrayContaining(expectedValues))
      expect(actualValues.length).toBe(expectedValues.length)
    })
  })

  describe('Resource Interface', () => {
    test('should create Resource with resourceType', () => {
      const resource: Resource = {
        resourceType: ResourceType.CODE_REPOSITORY
      }
      expect(resource.resourceType).toBe(ResourceType.CODE_REPOSITORY)
    })

    test('should create Resource with resourceType and resourceIdentifier', () => {
      const resource: Resource = {
        resourceType: ResourceType.CODE_REPOSITORY,
        resourceIdentifier: 'repo-123'
      }
      expect(resource.resourceType).toBe(ResourceType.CODE_REPOSITORY)
      expect(resource.resourceIdentifier).toBe('repo-123')
    })

    test('should accept SECRET resourceType', () => {
      const resource: Resource = {
        resourceType: ResourceType.SECRET,
        resourceIdentifier: 'secret-456'
      }
      expect(resource.resourceType).toBe(ResourceType.SECRET)
      expect(resource.resourceIdentifier).toBe('secret-456')
    })
  })

  describe('RBACProps Interface', () => {
    test('should create RBACProps with rbac', () => {
      const props: RBACProps = {
        rbac: {
          resource: {
            resourceType: ResourceType.CODE_REPOSITORY
          },
          permissions: [PermissionIdentifier.CODE_REPO_CREATE]
        }
      }
      expect(props.rbac).toBeDefined()
      expect(props.rbac?.resource.resourceType).toBe(ResourceType.CODE_REPOSITORY)
      expect(props.rbac?.permissions).toContain(PermissionIdentifier.CODE_REPO_CREATE)
    })

    test('should allow rbac to be undefined', () => {
      const props: RBACProps = {}
      expect(props.rbac).toBeUndefined()
    })

    test('should handle multiple permissions', () => {
      const props: RBACProps = {
        rbac: {
          resource: {
            resourceType: ResourceType.CODE_REPOSITORY
          },
          permissions: [PermissionIdentifier.CODE_REPO_CREATE, PermissionIdentifier.CODE_REPO_DELETE]
        }
      }
      expect(props.rbac?.permissions.length).toBe(2)
    })
  })

  describe('RBACSplitProps Interface', () => {
    test('should extend RBACProps', () => {
      const props: RBACSplitProps = {
        rbac: {
          resource: {
            resourceType: ResourceType.CODE_REPOSITORY
          },
          permissions: [PermissionIdentifier.CODE_REPO_CREATE]
        }
      }
      expect(props.rbac).toBeDefined()
    })

    test('should have buttonRbac property', () => {
      const props: RBACSplitProps = {
        buttonRbac: {
          resource: {
            resourceType: ResourceType.CODE_REPOSITORY
          },
          permissions: [PermissionIdentifier.CODE_REPO_CREATE]
        }
      }
      expect(props.buttonRbac).toBeDefined()
    })

    test('should have dropdownRbac property', () => {
      const props: RBACSplitProps = {
        dropdownRbac: {
          resource: {
            resourceType: ResourceType.SECRET
          },
          permissions: [PermissionIdentifier.DELETE_SECRET]
        }
      }
      expect(props.dropdownRbac).toBeDefined()
    })

    test('should allow all RBAC props to be undefined', () => {
      const props: RBACSplitProps = {}
      expect(props.rbac).toBeUndefined()
      expect(props.buttonRbac).toBeUndefined()
      expect(props.dropdownRbac).toBeUndefined()
    })
  })

  describe('RbacButtonProps Interface', () => {
    test('should extend RBACProps', () => {
      const props: RbacButtonProps = {
        rbac: {
          resource: {
            resourceType: ResourceType.CODE_REPOSITORY
          },
          permissions: [PermissionIdentifier.CODE_REPO_CREATE]
        },
        children: 'Click me'
      }
      expect(props.rbac).toBeDefined()
      expect(props.children).toBe('Click me')
    })

    test('should have tooltip property', () => {
      const props: RbacButtonProps = {
        tooltip: {
          title: 'Custom title',
          content: 'Custom content'
        },
        children: 'Button'
      }
      expect(props.tooltip?.title).toBe('Custom title')
      expect(props.tooltip?.content).toBe('Custom content')
    })

    test('should allow tooltip to be undefined', () => {
      const props: RbacButtonProps = {
        children: 'Button'
      }
      expect(props.tooltip).toBeUndefined()
    })
  })

  describe('RbacSplitButtonProps Interface', () => {
    test('should extend RBACSplitProps', () => {
      const props: RbacSplitButtonProps<'action1' | 'action2'> = {
        rbac: {
          resource: {
            resourceType: ResourceType.CODE_REPOSITORY
          },
          permissions: [PermissionIdentifier.CODE_REPO_CREATE]
        },
        options: [
          { label: 'Action 1', value: 'action1' },
          { label: 'Action 2', value: 'action2' }
        ],
        handleButtonClick: () => {},
        handleOptionChange: () => {},
        children: 'Button'
      }
      expect(props.rbac).toBeDefined()
      expect(props.options).toBeDefined()
    })

    test('should have tooltip property', () => {
      const props: RbacSplitButtonProps<'action'> = {
        tooltip: {
          title: 'Split Button Tooltip',
          content: 'Content'
        },
        options: [{ label: 'Action', value: 'action' }],
        handleButtonClick: () => {},
        handleOptionChange: () => {},
        children: 'Button'
      }
      expect(props.tooltip?.title).toBe('Split Button Tooltip')
    })
  })

  describe('RbacMoreActionsTooltipActionData Interface', () => {
    test('should extend ActionData and RBACProps', () => {
      const action: RbacMoreActionsTooltipActionData = {
        title: 'Delete',
        iconName: 'trash',
        rbac: {
          resource: {
            resourceType: ResourceType.CODE_REPOSITORY
          },
          permissions: [PermissionIdentifier.CODE_REPO_DELETE]
        }
      }
      expect(action.title).toBe('Delete')
      expect(action.iconName).toBe('trash')
      expect(action.rbac).toBeDefined()
    })

    test('should allow rbac to be undefined', () => {
      const action: RbacMoreActionsTooltipActionData = {
        title: 'Action',
        iconName: 'edit'
      }
      expect(action.rbac).toBeUndefined()
    })
  })

  describe('RbacMoreActionsTooltipProps Interface', () => {
    test('should have actions array', () => {
      const props: RbacMoreActionsTooltipProps = {
        actions: [
          {
            title: 'Action 1',
            iconName: 'edit',
            rbac: {
              resource: {
                resourceType: ResourceType.CODE_REPOSITORY
              },
              permissions: [PermissionIdentifier.CODE_REPO_CREATE]
            }
          }
        ]
      }
      expect(props.actions.length).toBe(1)
      expect(props.actions[0].title).toBe('Action 1')
    })

    test('should handle empty actions array', () => {
      const props: RbacMoreActionsTooltipProps = {
        actions: []
      }
      expect(props.actions.length).toBe(0)
    })
  })

  describe('rbacTooltip Constant', () => {
    test('should have correct value', () => {
      expect(rbacTooltip).toBe('You are missing the permission for this action.')
    })

    test('should be a string', () => {
      expect(typeof rbacTooltip).toBe('string')
    })
  })

  describe('Type Compatibility', () => {
    test('should allow ResourceType values in Resource', () => {
      const resource1: Resource = {
        resourceType: ResourceType.CODE_REPOSITORY
      }
      const resource2: Resource = {
        resourceType: ResourceType.SECRET
      }
      expect(resource1.resourceType).toBeDefined()
      expect(resource2.resourceType).toBeDefined()
    })

    test('should allow PermissionIdentifier values in permissions array', () => {
      const permissions: PermissionIdentifier[] = [
        PermissionIdentifier.CODE_REPO_CREATE,
        PermissionIdentifier.CODE_REPO_DELETE,
        PermissionIdentifier.UPDATE_SECRET,
        PermissionIdentifier.DELETE_SECRET
      ]
      expect(permissions.length).toBe(4)
      expect(permissions).toContain(PermissionIdentifier.CODE_REPO_CREATE)
    })
  })
})
