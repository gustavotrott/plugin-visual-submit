# Repository of a plugin for BigBlueButton

## Description

The Visual Submit plugin allows students to upload images during BigBlueButton sessions while enabling presenters to view and manage all submitted visual content in real-time.

### Features

#### User View (Students)
- **Image Upload**: Students can select and upload image files through a user-friendly file input interface
- **Image Preview**: Real-time preview of selected images before submission
- **File Validation**: Only image files are accepted (PNG, JPEG, GIF, etc.)
- **Submit Button**: Clear submission workflow with visual feedback

#### Presenter View (Instructors)
- **File Gallery**: View all uploaded images in a organized list format
- **File Details**: See file information including name, size, type, upload time, and uploader
- **Image Thumbnails**: Quick visual preview of each submitted image
- **File Actions**: View images in full size and manage submissions

## Building the Plugin

To build the plugin for production use, follow these steps:

```bash
cd $HOME/src/plugin-template
npm ci
npm run build-bundle
```

The above command will generate the `dist` folder, containing the bundled JavaScript file named `visual-submit.js`. This file can be hosted on any HTTPS server along with its `manifest.json`.

If you install the Plugin separated to the manifest, remember to change the `javascriptEntrypointUrl` in the `manifest.json` to the correct endpoint.

To use the plugin in BigBlueButton, send this parameter along in create call:

```
pluginManifests=[{"url":"<your-domain>/path/to/manifest.json"}]
```

Or additionally, you can add this same configuration in the `.properties` file from `bbb-web` in `/usr/share/bbb-web/WEB-INF/classes/bigbluebutton.properties`


## Development mode

As for development mode (running this plugin from source), please, refer back to https://github.com/bigbluebutton/bigbluebutton-html-plugin-sdk section `Running the Plugin from Source`
