#!/bin/bash

# Create directory structure
mkdir -p docs/{getting-started,guides,api,architecture,features,security,maintenance,reference}

# Move existing files to their new locations
mv docs/getting-started.md docs/getting-started/installation.md
mv docs/architecture.md docs/architecture/overview.md
mv docs/api.md docs/api/overview.md
mv docs/development.md docs/guides/development.md
mv docs/deployment.md docs/guides/deployment.md
mv docs/troubleshooting.md docs/guides/troubleshooting.md
mv docs/features.md docs/features/overview.md
mv docs/security.md docs/security/overview.md
mv docs/changelog.md docs/reference/changelog.md
mv docs/contributing.md docs/reference/contributing.md
mv docs/license.md docs/reference/license.md
mv docs/support.md docs/reference/support.md

# Create additional documentation files
touch docs/getting-started/{prerequisites,quick-start}.md
touch docs/api/{authentication,endpoints,websockets}.md
touch docs/architecture/{frontend,backend,database}.md
touch docs/features/{authentication,ui-components,state-management,data-visualization}.md
touch docs/security/{authentication,data-protection,best-practices}.md
touch docs/maintenance/{monitoring,backup,recovery}.md 