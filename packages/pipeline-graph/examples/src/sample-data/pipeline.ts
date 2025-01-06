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
                       - run: go test
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
                                        - run: go build
                                        - run: go build
                  - run: npm run
                  - run: npm test
`;
