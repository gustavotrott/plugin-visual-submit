import {
  BbbPluginSdk, DataChannelTypes, GenericContentSidekickArea, pluginLogger,
} from 'bigbluebutton-html-plugin-sdk';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import axios from 'axios';
import { PresenterSidekickArea } from '../sidekick-content/presenter-view/component';
import { UserSidekickArea } from '../sidekick-content/user-view/component';
import { MobileCapture } from '../mobile-capture/component';
import { SubmitImage, UserMetadataGraphqlResponse } from './types';
import { USERS_METADATA } from '../sidekick-content/user-view/queries';

interface PluginVisualSubmitProps {
  pluginUuid: string;
}

function PluginVisualSubmit({ pluginUuid }: PluginVisualSubmitProps): React.ReactElement {
  BbbPluginSdk.initialize(pluginUuid);
  const pluginApi = BbbPluginSdk.getPluginApi(pluginUuid, 'plugin-visual-submit');

  const { data: currentUser } = pluginApi.useCurrentUser();
  const {
    data: userMetadata,
  } = pluginApi.useCustomSubscription<UserMetadataGraphqlResponse>(USERS_METADATA);
  const {
    data: submitImageResponseData,
    pushEntry: pushSubmitImage,
  } = pluginApi.useDataChannel<SubmitImage>('submitImage', DataChannelTypes.ALL_ITEMS);

  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState<boolean>(false);

  const params = new URLSearchParams(window.location.search);
  const sessionToken = params.get('sessionToken');

  const handleImageSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;

    if (!file || !file.type.startsWith('image/')) {
      setSubmitError('Please select a valid image file.');
      return;
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await axios.post('/api/plugin/VisualSubmit/fileUpload/', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-session-token': sessionToken,
        },
      });

      const { url } = response.data;

      // Submit to data channel
      const submitData: SubmitImage = {
        imageUrl: url,
        submittedBy: {
          userId: currentUser.userId,
          userName: currentUser.name,
        },
      };

      pushSubmitImage(submitData);
      e?.currentTarget?.reset();
      setSubmitSuccess(true);
      // setTimeout(() => {
      //   setSubmitSuccess(false);
      // }, 3000);
    } catch (error) {
      pluginLogger.error('Upload error', error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        switch (status) {
          case 413:
            setSubmitError('File is too large. Please select a smaller image.');
            return;
          case 415:
            setSubmitError('File type not supported. Please select a valid image file.');
            return;
          default:
            if (error.response?.data?.error) {
              setSubmitError(error.response.data.error);
              return;
            }
            if (status && status >= 500) {
              setSubmitError('Server error. Please try again later.');
              return;
            }
            setSubmitError(`Upload failed: ${error.response?.statusText || 'Unknown error'}`);
            return;
        }
      }

      if (error instanceof Error) {
        setSubmitError(`Upload failed: ${error.message}`);
        return;
      }

      setSubmitError('Upload failed. Please check your connection and try again.');
    }
  };

  React.useEffect(() => {
    if (!userMetadata) return;

    // eslint-disable-next-line arrow-body-style
    const isMobileCapture = userMetadata.user_metadata.some((currUserMetadata) => {
      return currUserMetadata.parameter === 'is_mobile_capture' && currUserMetadata.value === '1';
    });

    if (isMobileCapture) {
      const appElement = document.getElementById('app');
      if (appElement) {
        appElement.innerHTML = '';

        const root = ReactDOM.createRoot(appElement);
        root.render(
          <MobileCapture
            onImageCapture={handleImageSubmit}
            submitError={submitError}
            submitSuccess={submitSuccess}
          />,
        );
      }
      return;
    }

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
                  handleImageSubmit,
                  currentUser,
                  submitImageResponseData: submitImageResponseData?.data || [],
                  submitError,
                  setSubmitError,
                  submitSuccess,
                }}
              />,
            );
          }

          return root;
        },
      }),
    ]);
  }, [
    currentUser,
    userMetadata,
    submitImageResponseData,
    pluginApi,
    handleImageSubmit,
  ]);

  return null;
}

export default PluginVisualSubmit;
