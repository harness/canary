export const demoPSYaml = `pipeline:
  stages:
  - parallel:
      stages:
      - steps:
        - run:
            container: node
            script: npm install
        - run:
            container: node
            script: npm test

      - steps:
        - run:
            container: golang:1.23
            script: go build
        - run:
            container: golang:1.23
            script: go test -cover

  - steps:
    - template:
        uses: docker
        with:
          connector: connector.dockerhub
          repo: harness/petstore
          tags: latest

    - template:
        uses: slack
        with:
          channel: general
`
