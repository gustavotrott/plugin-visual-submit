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
import { ImageViewModal } from '../modal/image-view/component';
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
    deleteEntry: deleteSubmitImage,
    replaceEntry: replaceSubmitImage,
  } = pluginApi.useDataChannel<SubmitImage>('submitImage', DataChannelTypes.ALL_ITEMS);

  const submittedImages = submitImageResponseData?.data || [];

  React.useEffect(() => {
    if (replaceSubmitImage && !currentUser?.presenter) {
      const userSubmitCount: { [key: string]: number } = {};
      submittedImages.filter((submittedImage) => {
        if (
          submittedImage.payloadJson.sentToLearningAnalyticsDashboard
        ) {
          const currentUserSubmitCount = userSubmitCount[
            submittedImage.payloadJson.submittedBy.userId]
            ? userSubmitCount[submittedImage.payloadJson.submittedBy.userId] : 0;
          userSubmitCount[
            submittedImage.payloadJson.submittedBy.userId
          ] = currentUserSubmitCount + 1;
        }
        return !submittedImage.payloadJson.sentToLearningAnalyticsDashboard;
      }).forEach(
        (submittedImage) => {
          const submitNumber = userSubmitCount[submittedImage.payloadJson.submittedBy.userId]
            ? userSubmitCount[submittedImage.payloadJson.submittedBy.userId] : 0;
          const submitColumnTitle = `Submit ${submitNumber + 1}`;
          pluginApi.sendGenericDataForLearningAnalyticsDashboard({
            columnTitle: submitColumnTitle,
            value: `![Submit ${submitNumber + 1}](${submittedImage.payloadJson.imageUrl})`,
            cardTitle: 'Visual Submit',
          });
          pluginApi.persistEvent('Visual Submit', {
            imageUrl: submittedImage.payloadJson.imageUrl,
            submittedBy: submittedImage.payloadJson.submittedBy,
          });
          replaceSubmitImage(submittedImage.entryId, {
            ...submittedImage.payloadJson,
            sentToLearningAnalyticsDashboard: true,
          });
        },
      );
    }
  }, [submittedImages, replaceSubmitImage, currentUser]);

  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState<boolean>(false);
  const [isImageViewModalOpen, setIsImageViewModalOpen] = React.useState<boolean>(false);
  const [selectedImageUrl, setSelectedImageUrl] = React.useState<string>('');
  const [selectedImageEntryId, setSelectedImageEntryId] = React.useState<string>('');
  const [selectedImageSubmission, setSelectedImageSubmission] = React.useState<{
    userId: string;
    userName: string;
    imageIndex?: number;
    totalImages?: number;
  } | null>(null);

  // Find the current submitted image data
  const currentSubmittedImageData = React.useMemo(() => {
    if (!selectedImageEntryId || !selectedImageSubmission) return undefined;

    const imageData = submittedImages.find((item) => item.entryId === selectedImageEntryId);
    if (!imageData) return undefined;

    return {
      imageUrl: selectedImageUrl,
      submittedBy: {
        userId: selectedImageSubmission.userId,
        userName: selectedImageSubmission.userName,
      },
      imageIndex: selectedImageSubmission.imageIndex,
      totalImages: selectedImageSubmission.totalImages,
      isCorrect: imageData.payloadJson.isCorrect,
      feedback: imageData.payloadJson.feedback,
      sentToLearningAnalyticsDashboard:
        imageData.payloadJson.sentToLearningAnalyticsDashboard || false,
    };
  }, [selectedImageEntryId, selectedImageSubmission, selectedImageUrl, submittedImages]);

  const params = new URLSearchParams(window.location.search);
  const sessionToken = params.get('sessionToken');

  const handleViewFile = React.useCallback((
    fileUrl: string,
    submissionData?: {
      userId: string;
      userName: string;
      imageIndex?: number;
      totalImages?: number;
    },
    entryId?: string,
  ) => {
    setSelectedImageUrl(fileUrl);
    setSelectedImageEntryId(entryId || '');
    setSelectedImageSubmission(submissionData || null);
    setIsImageViewModalOpen(true);
  }, []);

  const handleCloseImageModal = React.useCallback(() => {
    setIsImageViewModalOpen(false);
    setSelectedImageUrl('');
    setSelectedImageEntryId('');
    setSelectedImageSubmission(null);
  }, []);

  const handleValidateImage = React.useCallback((isCorrect: boolean) => {
    if (!selectedImageEntryId) {
      pluginLogger.error('No entryId available for validation');
      return;
    }

    // Update the image validation status
    const updatedPayload: SubmitImage = {
      imageUrl: selectedImageUrl,
      submittedBy: selectedImageSubmission ? {
        userId: selectedImageSubmission.userId,
        userName: selectedImageSubmission.userName,
      } : { userId: '', userName: '' },
      isCorrect,
      feedback: currentSubmittedImageData?.feedback,
      sentToLearningAnalyticsDashboard:
        currentSubmittedImageData?.sentToLearningAnalyticsDashboard || false,
    };

    replaceSubmitImage(selectedImageEntryId, updatedPayload);

    pluginLogger.info('Image validation updated:', {
      isCorrect,
      entryId: selectedImageEntryId,
      imageUrl: selectedImageUrl,
    });
  }, [
    selectedImageUrl,
    selectedImageEntryId,
    selectedImageSubmission,
    currentSubmittedImageData?.feedback,
    replaceSubmitImage,
  ]);

  const handleSendFeedback = React.useCallback(async (feedback: string) => {
    if (!selectedImageEntryId || !selectedImageSubmission) {
      pluginLogger.error('No entryId or submission data available for feedback');
      return;
    }

    // Update the image with feedback
    const updatedPayload: SubmitImage = {
      imageUrl: selectedImageUrl,
      submittedBy: selectedImageSubmission ? {
        userId: selectedImageSubmission.userId,
        userName: selectedImageSubmission.userName,
      } : { userId: '', userName: '' },
      isCorrect: currentSubmittedImageData?.isCorrect,
      feedback,
      sentToLearningAnalyticsDashboard:
        currentSubmittedImageData?.sentToLearningAnalyticsDashboard || false,
    };

    replaceSubmitImage(selectedImageEntryId, updatedPayload);

    pluginLogger.info('Image feedback updated:', {
      feedback,
      entryId: selectedImageEntryId,
      imageUrl: selectedImageUrl,
    });
  }, [
    selectedImageUrl,
    selectedImageEntryId,
    selectedImageSubmission,
    currentSubmittedImageData?.isCorrect,
    replaceSubmitImage,
    pluginApi,
  ]);

  const handleImageSubmit = React.useCallback(async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
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
        sentToLearningAnalyticsDashboard: false,
      };

      pushSubmitImage(submitData, {
        receivers: [
          { userId: currentUser.userId },
          { role: DataChannelPushEntryFunctionUserRole.PRESENTER },
        ],
      });
      e?.currentTarget?.reset();
      setSubmitSuccess(true);
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
  }, [currentUser?.userId, currentUser?.name, sessionToken, pushSubmitImage]);

  React.useEffect(() => {
    if (!currentUser || !pluginApi) return;

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
                  pluginApi,
                  currentUser,
                  handleViewFile,
                  deleteSubmitImage,
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
                  submitError,
                  setSubmitError,
                  handleViewFile,
                }}
              />,
            );
          }

          return root;
        },
      }),
    ]);
  }, [
    currentUser?.presenter,
    currentUser?.userId,
    submitError,
    handleViewFile,
  ]);

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
    }
  }, [userSessionCurrent, handleImageSubmit, submitError, submitSuccess]);

  return (
    <ImageViewModal
      isOpen={isImageViewModalOpen}
      onRequestClose={handleCloseImageModal}
      isPresenter={currentUser?.presenter}
      submittedImageData={currentSubmittedImageData}
      onValidateImage={handleValidateImage}
      onSendFeedback={handleSendFeedback}
    />
  );
}

export default PluginVisualSubmit;
