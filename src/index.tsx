import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import PluginVisualSubmit from './components/visual-submit/component';

const uuid = document.currentScript?.getAttribute('uuid') || 'root';

const root = ReactDOM.createRoot(document.getElementById(uuid));
root.render(
  <PluginVisualSubmit
    pluginUuid={uuid}
  />,
);
