export const pipeline = `
pipeline:
  stages:
    - group:
        stages:
          - steps:
            - run: go build
            - run: go test
          - steps:
            - run: npm run
            - run: npm test 
    
`
