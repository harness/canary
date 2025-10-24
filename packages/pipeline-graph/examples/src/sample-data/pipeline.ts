export const pipeline = `pipeline:
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

export const pipeline2 = `
pipeline:
  stages:
    - steps:
      - run: go build
      - parallel:
          steps:
          - parallel:
              steps:
                - parallel:
                    steps:
                      - run: go test
                      - run: go test
    - group:
        stages:
          - parallel:
              stages:
                - steps:
                  - run: go build
                  - run: go test
                  - group:
                     steps:
                       - run: go build

                       - parallel:
                          steps:
                            - run: go build
                            - run: go build
                            - group:
                                steps:

                                  - parallel:
                                      steps:
                                        - run: go build
                                        - run: go build
                                        - group:
                                            steps:
                                              - run: go build
                                              - run: go build
                                  - run: go build

                - steps:
                  - parallel:
                     steps:
                       - run: go build
                       - run: go build
                       - group:
                          steps:
                            - run: go build
                            - run: go build
                            - parallel:
                                steps:
                                  - run: go build
                                  - run: go build
                                  - group:
                                      steps:

                                        - parallel:
                                            steps:
                                              - run: go build
                                              - run: go build
                                              - group:
                                                  steps:
                                                    - run: go build
                                                    - run: go build
                                        - run: go build
                  - run: npm run
                  - run: npm test
`
