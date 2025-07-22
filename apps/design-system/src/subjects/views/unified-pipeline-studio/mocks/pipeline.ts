export const pipeline1 = `pipeline:
  stages:
    - group:
        stages:
            - parallel:
                stages:
                - name: CI Stage
                  steps:
                    - run: go build
                    - run: go test     
                - name: CD Stage
                  steps:
                    - run: npm test
                  environment: 
                    id: prod
                    deploy-to: dev-cluster
                  service: nginx
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
