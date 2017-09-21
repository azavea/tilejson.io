# Project Checklist

Delete each item when it's completed or if it's not relevant to this project.

Delete this file after all steps have been completed.

## GitHub

* Create GitHub repository
* Create `develop` and `master` branches
* Make `develop` the default branch
* Make `develop` and `master` branches protected
* Grant `Azavea Developers` "Admin" access to repository (Setting > Collaborators & teams)
* Determine project LICENSE

## Source Code

* Copy "Civic Apps App Template" contents (See https://github.com/azavea/civic-apps-app-template/wiki)
* Replace references to `Project Name` in `README`
* Replace references to `${project_name_...}` in `scripts`
* Replace references to `tilejson.io` in `Vagrantfile`, `Jenkinsfile`,
  `docker-compose.yml`, and `src/app/package.json`
* Rename files containing `tilejson.io` in `deployment/ansible`

## Design Prototype

* Verify that prototype works in all browsers we intend to support
* Convert prototype to React
* Archive static prototype assets (skip this step if prototype was created in React)
  * Push `prototype` branch to upstream repository

## Project Management

* Add project to Waffle.io

## Continuous Integration

* Setup PR builder (Travis CI, Jenkins, etc.)
  * Execute the `cibuild.sh` command
* Verify that `lint.sh` and `test.sh` commands work

## Staging Deployments

* Create IAM role
* Obtain credentials
  * SSH key
  * AWS credentials
* Update deployment scripts (`cibuild.sh`, Terraform, etc.)
* Setup Jenkins to deploy from the `develop` branch
  * Execute the `cipublish.sh` command

## Production Deployments

* Create IAM role
* Obtain credentials
  * SSH key
  * AWS credentials
* Update deployment scripts (`cibuild.sh`, Terraform, etc.)
* Setup Jenkins to deploy from the `master` branch
  * Execute the `cipublish.sh` command

## HTTP Services

* Expose `version.txt` endpoint

## Python packages

* Include version number in `setup.py`
* Setup Python debug logging
