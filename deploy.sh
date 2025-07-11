#!/bin/bash

if [ ! -d ./node_modules ] ; then
	npm install
fi

# Get library name from webpack config
LIBRARY_NAME=$(node -p "require('./webpack.config.js').output.library")

npm ci
npm run build-bundle
sudo mkdir -p /var/www/bigbluebutton-default/assets/plugins
sudo cp dist/manifest.json /var/www/bigbluebutton-default/assets/plugins/${LIBRARY_NAME}Manifest.json
sudo cp dist/${LIBRARY_NAME}.js /var/www/bigbluebutton-default/assets/plugins/${LIBRARY_NAME}.js

# Add config to load the plugin
BBB_WEB_OVERRIDE_CONFIG_FILE="/etc/bigbluebutton/bbb-web.properties"
TARGET_URL="https://$(hostname)/plugins/${LIBRARY_NAME}Manifest.json"

echo "Adding plugin manifest to bbb-web config: $TARGET_URL"

if grep -q "$TARGET_URL" "$BBB_WEB_OVERRIDE_CONFIG_FILE"; then
  echo "Plugin already present. No changes made."
  exit 0
fi

ESCAPED_URL=$(echo "$TARGET_URL" | sed 's/[\/&]/\\&/g')

if sudo grep -q "^pluginManifests=" "$BBB_WEB_OVERRIDE_CONFIG_FILE"; then
  sudo sed -i "/^pluginManifests=/ s/]$/, {\"url\":\"$ESCAPED_URL\"}]/" "$BBB_WEB_OVERRIDE_CONFIG_FILE"
  echo "Appended plugin to existing pluginManifests."
else
  echo "pluginManifests=[{\"url\":\"$TARGET_URL\"}]" | sudo tee -a "$BBB_WEB_OVERRIDE_CONFIG_FILE" > /dev/null
  echo "Added new pluginManifests property."
fi


# Reload bbb-web with new config
sudo systemctl restart bbb-web
