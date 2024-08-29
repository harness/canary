import { Icon } from '@harnessio/canary'
import React from 'react'

export const mockOverviewData = [
  {
    header: [
      {
        avatar: <Icon name="harness" size={14} />,
        name: 'Fgarson',
        description: 'opened a pull request'
      }
    ],
    icon: <Icon name="chaos-engineering" size={14} />,
    content:
      'Hello world! This pull request introduces a major update to the user interface, aiming to improve usability and accessibility. It includes a complete overhaul of the navigation menu, making it more intuitive and user-friendly. Additionally, several visual elements have been redesigned to align with the latest branding guidelines. Code refactoring has also been performed to optimize performance and maintainability. Please review the changes carefully and provide feedback or approval for merging.'
  },
  {
    header: [
      {
        avatar: <Icon name="harness" size={14} />,
        name: 'Alex',
        description: 'updated documentation'
      }
    ],
    icon: <Icon name="chaos-engineering" size={14} />,
    content:
      'The documentation has been updated to reflect the new GitHub Actions workflows introduced for our CI/CD pipeline. This update includes detailed instructions on setting up continuous integration for a Node.js application, including how to configure the workflow YAML files and securely manage secrets. Additionally, the documentation now covers best practices for workflow management, including tips for optimizing build times and handling common issues. This comprehensive guide aims to streamline the setup process and improve team efficiency.'
  },
  {
    header: [
      {
        avatar: <Icon name="harness" size={14} />,
        name: 'Jordan',
        description: 'fixed a bug in the deployment script'
      }
    ],
    icon: <Icon name="chaos-engineering" size={14} />,
    content:
      'This update addresses a critical bug in the deployment script that resulted in intermittent failures during production deployments. The issue was traced back to an incorrect variable reference, which has now been corrected. With this fix, deployments should proceed smoothly without unexpected interruptions. The deployment process has been thoroughly tested to ensure stability and reliability. This fix is crucial for maintaining continuous delivery and minimizing downtime.'
  },
  {
    header: [
      {
        avatar: <Icon name="harness" size={14} />,
        name: 'Taylor',
        description: 'added a new GitHub Action'
      }
    ],
    icon: <Icon name="chaos-engineering" size={14} />,
    content:
      'A new GitHub Action has been added to our workflow to automatically run code linting checks on each push to the repository. This action helps in maintaining code quality by ensuring that the code adheres to style guidelines and best practices before merging. The linting process checks for common coding errors and enforces consistent formatting, contributing to a cleaner and more maintainable codebase.'
  },
  {
    header: [
      {
        avatar: <Icon name="harness" size={14} />,
        name: 'Morgan',
        description: 'merged changes from development'
      }
    ],
    icon: <Icon name="chaos-engineering" size={14} />,
    content:
      'Merged the latest changes from the development branch into the main branch. This merge includes several important bug fixes, performance enhancements, and updates to the build configuration. All associated tests have been executed and passed successfully. The integration of these changes ensures that the main branch remains up-to-date with the latest improvements and fixes, enhancing overall project stability and functionality.'
  }
]

export default mockOverviewData
