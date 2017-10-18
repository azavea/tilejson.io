#!/bin/bash

set -e

if [[ -n "${TILEJSON_IO_DEBUG}" ]]; then
    set -x
fi

function usage() {
    echo -n "Usage: $(basename "$0")

Builds and pulls container images using docker-compose.
"
}

if [ "${BASH_SOURCE[0]}" = "${0}" ]
then
    if [ "${1:-}" = "--help" ]
    then
        usage
    else
        # Install NPM modules
        docker-compose \
            -f docker-compose.yml \
            run --rm --no-deps app \
            yarn

        # Build containers.
        docker-compose \
            -f docker-compose.yml \
            build
    fi
fi
