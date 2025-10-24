export const pipelineYaml1 = `pipeline:
  stages:
    - group:
        stages:
          - parallel:
              stages:
                - steps:
                    - run: go build
                    - run: go test
                - steps:
                    - run: npm test
          - group:
              stages:
                - steps:
                    - group:
                        steps:
                          - run: go build
                          - run: go test

                    - parallel:
                        steps:
                          - run: go build
                          - run: go test      
`
