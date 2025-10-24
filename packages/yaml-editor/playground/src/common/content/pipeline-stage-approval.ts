export const stageApproval = `inputs:
  - type: string
    name: username
    value: qwe
  - type: string
    name: key
    value: 123
pipeline:
  stages:
    - steps:
      - run:
          script: echo one
      - run:
          script: echo two
    - approval:
        uses: harness
        with:
          timeout: 30m
          message: "this is an approval prompt"
          groups: [ "admins", "ops" ]
          min-approvers: 1
    - steps:
      - run:
          script: echo three
      - run:
          script: echo four`
