import {
  BbbPluginSdk, DataChannelTypes, GenericContentSidekickArea, pluginLogger,
} from 'bigbluebutton-html-plugin-sdk';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import { PresenterSidekickArea } from '../sidekick-content/presenter-view/component';
import { UserSidekickArea } from '../sidekick-content/user-view/component';
import { SubmitImage } from './types';

interface PluginVisualSubmitProps {
  pluginUuid: string;
}

function PluginVisualSubmit({ pluginUuid }: PluginVisualSubmitProps): React.ReactElement {
  BbbPluginSdk.initialize(pluginUuid);
  const pluginApi = BbbPluginSdk.getPluginApi(pluginUuid, 'plugin-visual-submit');
  const { data: currentUser } = pluginApi.useCurrentUser();

  const {
    data: submitImageResponseData,
    pushEntry: pushSubmitImage,
  } = pluginApi.useDataChannel<SubmitImage>('submitImage', DataChannelTypes.ALL_ITEMS);

  const handleSubmitImage = (imageUrl: string) => {
    if (!imageUrl || !currentUser) {
      pluginLogger.error('Image and userId are required to submit an image.');
      return;
    }

    const submitData: SubmitImage = {
      imageUrl,
      submittedBy: {
        userId: currentUser.userId,
        userName: currentUser.name,
      },
    };
    pushSubmitImage(submitData);
  };

  React.useEffect(() => {
    pluginApi.setGenericContentItems([
      new GenericContentSidekickArea({
        id: 'visual-submit-sidekick',
        name: 'Visual Submit',
        section: 'Visual Submit',
        buttonIcon: 'video',
        open: false,
        contentFunction: (element: HTMLElement) => {
          const root = ReactDOM.createRoot(element);
          if (currentUser?.presenter) {
            root.render(
              <PresenterSidekickArea
                {...{
                  submittedImages: submitImageResponseData?.data || [],
                }}
              />,
            );
          } else {
            root.render(
              <UserSidekickArea
                {...{
                  pluginApi,
                  handleSubmitImage,
                  currentUser,
                  submitImageResponseData: submitImageResponseData?.data || [],
                }}
              />,
            );
          }

          return root;
        },
      }),
    ]);
  }, [currentUser, submitImageResponseData, pluginApi, handleSubmitImage]);

  return null;
}

export default PluginVisualSubmit;
