import {
  BbbPluginSdk,
  DataChannelPushEntryFunctionUserRole,
  DataChannelTypes,
  GenericContentSidekickArea,
  pluginLogger,
} from 'bigbluebutton-html-plugin-sdk';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import axios from 'axios';
import { PresenterSidekickArea } from '../sidekick-content/presenter-view/component';
import { UserSidekickArea } from '../sidekick-content/user-view/component';
import { MobileCapture } from '../mobile-capture/component';
import {
  SubmitImage,
  UserSessionCurrentGraphqlResponse,
  UserSessionsCountGraphqlResponse,
} from './types';
import {
  USER_OTHER_SESSIONS_COUNT, USER_SESSION_CURRENT,
} from '../sidekick-content/user-view/queries';

interface PluginVisualSubmitProps {
  pluginUuid: string;
}

function PluginVisualSubmit({ pluginUuid }: PluginVisualSubmitProps): React.ReactElement {
  BbbPluginSdk.initialize(pluginUuid);
  const sessionClosedIntervalRef = React.useRef<ReturnType<typeof setTimeout>>();
  const pluginApi = BbbPluginSdk.getPluginApi(pluginUuid, 'plugin-visual-submit');

  const { data: currentUser } = pluginApi.useCurrentUser();

  // Close mobile session if it's the only session for 20 seconds
  const {
    data: userOtherSessionsCount,
  } = pluginApi.useCustomSubscription<UserSessionsCountGraphqlResponse>(USER_OTHER_SESSIONS_COUNT);
  React.useEffect(() => {
    if (userOtherSessionsCount) {
      const countSessions = userOtherSessionsCount?.user_session_aggregate?.aggregate?.count || 0;
      if (countSessions === 0) {
        sessionClosedIntervalRef.current = setTimeout(() => {
          const appElement = document.getElementById('app');
          if (appElement) {
            window.location.href = 'about:blank';
          }
        }, 20000);
      } else {
        clearInterval(sessionClosedIntervalRef.current);
      }
    }
  }, [userOtherSessionsCount]);

  const {
    data: userSessionCurrent,
  } = pluginApi.useCustomSubscription<UserSessionCurrentGraphqlResponse>(USER_SESSION_CURRENT);

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

      pushSubmitImage(submitData, {
        receivers: [
          { userId: currentUser.userId },
          { role: DataChannelPushEntryFunctionUserRole.PRESENTER },
        ],
      });
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
    if (!userSessionCurrent) return;
    const isMobileCapture = userSessionCurrent.user_session_current[0].sessionName === 'visualSubmitMobileCaptureSession';

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
    userSessionCurrent,
    submitImageResponseData,
    pluginApi,
    handleImageSubmit,
  ]);

  return null;
}

export default PluginVisualSubmit;
