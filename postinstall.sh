#!/bin/bash

echo '*************************************************************************'
echo POSTINSTALL
echo '*************************************************************************'

#echo '*************************************************************************'
#echo Symbolick link
#echo '*************************************************************************'

mkdir -p dist/events
mkdir -p dist/routes
mkdir -p dist/socket-apis
mkdir -p dist/web-components
#
mkdir -p ./assets/js/
cp ./node_modules/socket.io-stream/socket.io-stream.js ./assets/js/
# you can start with the favicon images from civil-server - but you may want to replace them with your own some day
mkdir -p ./assets/images
cp -r node_modules/civil-server/assets/images ./assets/images

#
# Update/create web-components/index.js to require all react components in that director, and in the listed child/peer directories
#
node node_modules/civil-server/dist/tools/react-directory-indexer.js app/web-components/ node_modules/civil-server/dist/components/web-components/

#echo '*************************************************************************'
#echo TRANSPILE
#echo '*************#************************************************************'
#
npm run transpile  || {
  echo Could not transpile;
  exit 1
}
echo "transpile ok"

#echo '*************************************************************************'
#echo WEBPACK
#echo '*************************************************************************'

npm run packbuild  || {
  echo Could not webpack;
  exit 1
}
echo "webpack ok"


