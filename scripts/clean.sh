#!/bin/bash

set -e

if [[ -n "${project_name_DEBUG}" ]]; then
    set -x
fi

function usage() {
    echo -n "Usage: $(basename "$0")

Clean up unused Docker resources to free disk space.
"
}

if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    if [ "${1:-}" = "--help" ]; then
        usage
    else
        docker-compose down
        docker images -qf dangling=true | xargs -r docker rmi
        docker volume ls -qf dangling=true | xargs -r docker volume rm
    fi
fi
