#!/bin/bash

if [ ! -d ./node_modules ] ; then
	npm install
fi

# Get library name from webpack config
LIBRARY_NAME=$(node -p "require('./webpack.config.js').output.library")

# Copy nginx file
sudo mkdir -p /usr/share/bigbluebutton/nginx/
sudo cp plugin-run-dev.nginx /usr/share/bigbluebutton/nginx/bbb-plugin-run-dev.nginx
sudo systemctl restart nginx

# Copy manifest to correct place
sudo mkdir -p /var/www/bigbluebutton-default/assets/plugins
sudo cp manifest.json /var/www/bigbluebutton-default/assets/plugins/${LIBRARY_NAME}Manifest.json

# Tweak manifest to load from development server
TARGET_URL="https://$(hostname)/plugin-run-dev/${LIBRARY_NAME}.js"
MANIFEST_PATH=/var/www/bigbluebutton-default/assets/plugins/${LIBRARY_NAME}Manifest.json
jq --arg val "$TARGET_URL" '.javascriptEntrypointUrl = $val' $MANIFEST_PATH > temp.json && sudo mv temp.json $MANIFEST_PATH

npm start
