ARG IT_TOOLS_IMAGE=ghcr.io/corentinth/it-tools:latest
FROM ${IT_TOOLS_IMAGE}

ARG IT_TOOLS_BASE=/tools/it-tools/
ENV IT_TOOLS_BASE="${IT_TOOLS_BASE}"

COPY patch-base.py /tmp/patch-base.py

RUN set -euo pipefail \
    && apk add --no-cache python3 \
    && python3 /tmp/patch-base.py \
    && apk del python3 \
    && rm /tmp/patch-base.py
