#!/bin/bash

set -e

if [[ -n "${TILEJSON_IO_DEBUG}" ]]; then
    set -x
fi

function usage() {
    echo -n \
         "Usage: $(basename "$0") COMMAND [OPTIONS]
Execute Terraform subcommands with remote state management.
Required:
  AWS_PROFILE: Configuration profile name used to create AWS resources
  TILEJSON_IO_SITE_BUCKET: Bucket to house the application; CDN origin
  TILEJSON_IO_SETTINGS_BUCKET: Bucket to house infrastructure state and variables
"
}

if [ "${BASH_SOURCE[0]}" = "${0}" ]
then
    if [ "${1:-}" = "--help" ]
    then
        usage
    else
        if [[ -n "${TILEJSON_IO_SETTINGS_BUCKET}" ]] && [[ -n "${TILEJSON_IO_SITE_BUCKET}" ]]; then

            pushd "$(dirname "$0")/../deployment/terraform"

            aws s3 cp "s3://${TILEJSON_IO_SETTINGS_BUCKET}/terraform/terraform.tfvars" "${TILEJSON_IO_SETTINGS_BUCKET}.tfvars"

            case "${1}" in
                plan)
                    rm -rf .terraform terraform.tfstate*
                    terraform init -backend-config="bucket=${TILEJSON_IO_SETTINGS_BUCKET}" \
                                   -backend-config="key=terraform/state"
                    terraform plan \
                              -var-file="${TILEJSON_IO_SETTINGS_BUCKET}.tfvars" \
                              -out="${TILEJSON_IO_SETTINGS_BUCKET}.tfplan"

                    aws s3 sync --dryrun --delete ../../dist "s3://${TILEJSON_IO_SITE_BUCKET}"
                    ;;
                apply)
                    terraform apply "${TILEJSON_IO_SETTINGS_BUCKET}.tfplan"

                    aws s3 sync --delete ../../dist "s3://${TILEJSON_IO_SITE_BUCKET}"
                    ;;
                *)
                    echo "ERROR: I don't have support for that Terraform subcommand!"
                    exit 1
                    ;;
            esac

            popd
        else
            echo "ERROR: No TILEJSON_IO_SETTINGS_BUCKET or TILEJSON_IO_SITE_BUCKET variable defined."
            exit 1
        fi
    fi
fi