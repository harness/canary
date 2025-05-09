export const pipeline1 = `pipeline:
  stages:
    - group:
        stages:
            - parallel:
                stages:
                - name: CI Stage CI
                  steps:
                    - run: go build
                    - run: go test
                - name: CD Stage
                  steps:
                    - run: npm test
            - group:
                stages:
                - name: Custom Stage 1
                  steps:
                    - run: go build
                - name: Custom Stage 2
                  steps:
                    - run: npm run
                    - run: npm test  
`
