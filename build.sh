#!/bin/bash

echo '*************************************************************************'
echo POSTINSTALL
echo '*************************************************************************'

#echo '*************************************************************************'
#echo These directoies need to exist in dist, even if you don't have them in your project
#echo '*************************************************************************'

mkdir -p dist/events
mkdir -p dist/routes
mkdir -p dist/socket-apis
mkdir -p dist/web-components
#
# assets is where static files go
#
# you can start with the favicon images from civil-server - but you may want to replace them with your own some day
mkdir -p ./assets/images
cp -rp node_modules/civil-server/assets/images ./assets

echo '***'
echo Svgr
echo '***'
npm run svgr

#
# Update/create web-components/index.js to require all react components in that director, and in the listed child/peer directories
#
react-directory-indexer app/web-components/ node_modules/civil-server/dist/web-components/ node_modules/undebate/dist/web-components/
react-directory-indexer --data app/data-components/ node_modules/civil-server/dist/data-components/ node_modules/undebate/dist/data-components/

# need this for app/components/election-date but its kind of a kludge
jss convert node_modules/react-calendar/dist/Calendar.css -f js -e cjs > node_modules/react-calendar/dist/react-calendar-css.js

#echo '*************************************************************************'
#echo TRANSPILE
#echo '*************#************************************************************'
#
npm run transpile  || {
  echo Could not transpile;
  exit 1
}
echo "transpile ok"

echo '*************************************************************************'
echo WEBPACK
echo '*************************************************************************'

# don't run webpack if this is a dependency of another project - the memory usage will blow out heroku build 
if test \"$NPM_PROJECT\" = \"\" || test \"$NPM_PROJECT\" == \"undebate-ssp\" ; then {
  npm run packbuild  || {
    echo Could not webpack;
    exit 1
  }
}; fi

