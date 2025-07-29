import { splitObjectProps } from '../typeUtils'

describe('typeUtils', () => {
  describe('splitObjectProps', () => {
    it('should split an object into picked and rest properties', () => {
      const testObj = {
        name: 'John',
        age: 30,
        email: 'john@example.com',
        address: '123 Main St'
      }

      const { picked, rest } = splitObjectProps(testObj, ['name', 'email'])

      // Check picked properties
      expect(picked).toEqual({
        name: 'John',
        email: 'john@example.com'
      })

      // Check rest properties
      expect(rest).toEqual({
        age: 30,
        address: '123 Main St'
      })
    })

    it('should handle empty keys array', () => {
      const testObj = {
        name: 'John',
        age: 30
      }

      const { picked, rest } = splitObjectProps(testObj, [])

      // Check picked properties
      expect(picked).toEqual({})

      // Check rest properties
      expect(rest).toEqual({
        name: 'John',
        age: 30
      })
    })
  })
})
