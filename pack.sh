#!/usr/bin/env bash
name=$(jq -r '.name' package.json)-$(jq -r '.version' package.json)

zip -r "artifacts/${name}-dist.zip" \
    dist \
    img \
    LICENSE \
    manifest.json \
    README.md

git archive --format=zip -o "artifacts/${name}-source.zip" HEAD
