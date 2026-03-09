export const pipeline1 = `# Root comment
pipeline:
  stages:
    - steps:
        # Comment 1
        - name: run-step-1
          # Comment 2
          run:
            # Comment 3
            shell: powershell
            # Comment 4
            script: go build
            # Comment 4
            report:
              # Comment Before all
              # Comment before path: path-1
              - path: path-1
                # Comment before type (path-1)
                type: junit
                # Comment before path: path-2
              - path: path-2
                # Comment before type (path-2)
                type: xunit
                # Comment after all
            container:
              # Comment 10
              image: image 1
              # Comment 11
              connector: connector1
              # Comment 12
              credentials:
                # comment for username
                username: u
                # comment for password
                password: p
`

export const expectedPipeline1 = `# Root comment
pipeline:
  stages:
    - steps:
        # Comment 1
        - name: Updated step name
          # Comment 2
          run:
            # Comment 3
            shell: powershell
            # Comment 4
            script: go build
            # Comment 4
            report:
              # Comment Before all
              # Comment before path: path-1
              - path: path-1
                # Comment before type (path-1)
                type: junit
                # Comment before path: path-2
              - path: path-2
                # Comment before type (path-2)
                type: xunit
                # Comment after all
            container:
              # Comment 10
              image: image 1
              # Comment 11
              connector: connector1
              # Comment 12
              credentials:
                # comment for username
                username: u
                # comment for password
                password: p
`
