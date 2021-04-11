#!/bin/sh
NODE_MODULES_CACHE="./node_modules"
LERNA_CACHE="$NODE_MODULES_CACHE/.cache/netlify-lerna"

cache_deps() {
    PACKAGES=$(ls -1 $1)

    for PKG in $PACKAGES
    do
        PKG_NODE_MODULES="$1/$PKG/node_modules"
        if [ -d $PKG_NODE_MODULES ];
        then
            mv $PKG_NODE_MODULES $LERNA_CACHE/$PKG
            echo "[netlify-lerna] Cached node modules for $PKG"
        else
            echo "[netlify-lerna] Unale to cache node modules for $PKG"
        fi
    done
}

if [ "$NETLIFY" = "true" ];
then
  mkdir -p "$NODE_MODULES_CACHE/.cache/netlify-lerna"
  cache_deps packages
fi
