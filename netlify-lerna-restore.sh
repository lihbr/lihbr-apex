#!/bin/sh
NODE_MODULES_CACHE="./node_modules"
LERNA_CACHE="$NODE_MODULES_CACHE/.cache/netlify-lerna"

restore_deps() {
  PACKAGES=$(ls -1 $1)

  for PKG in $PACKAGES
  do
    PKG_CACHE="$LERNA_CACHE/$PKG"
    if [ -d $PKG_CACHE ];
    then
      mv $PKG_CACHE $1/$PKG/node_modules
      echo "[netlify-lerna] Restored node modules for $PKG"
    else
      echo "[netlify-lerna] Unable to restore cache for $PKG"
    fi
  done
}

if [ $NETLIFY = "true" ];
then
  mkdir -p "$NODE_MODULES_CACHE/.cache/netlify-lerna"
  restore_deps packages
fi
