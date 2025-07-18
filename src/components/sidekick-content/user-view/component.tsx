import * as React from 'react';
import {
  CurrentUserData,
  PluginApi,
  DataChannelTypes,
  DeleteEntryFunction,
} from 'bigbluebutton-html-plugin-sdk';
import * as Styled from './styles';
import * as DefaultStyled from '../shared/styles';
import * as CommonStyled from '../../../styles/common';
import { SubmitImage } from '../../visual-submit/types';
import { formatUploadTime } from '../../../utils/formatUploadTime';
import { QrCodeModal } from '../../modal/qr-code/component';
import { QRCodeIcon, TrashIcon } from '../../../utils/icons';

interface UserSidekickAreaProps {
  pluginApi: PluginApi;
  currentUser: CurrentUserData;
  submitError: string | null;
  setSubmitError: React.Dispatch<React.SetStateAction<string | null>>;
  handleImageSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleViewFile: (
    fileUrl: string,
    submissionData?: {
      userId: string;
      userName: string;
      imageIndex?: number;
      totalImages?: number;
    },
    entryId?: string,
  ) => void;
  deleteSubmitImage: DeleteEntryFunction;
}

export function UserSidekickArea({
  pluginApi,
  currentUser,
  submitError,
  setSubmitError,
  handleImageSubmit,
  handleViewFile,
  deleteSubmitImage,
}: UserSidekickAreaProps): React.ReactElement {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [photoSessionUrl, setPhotoSessionUrl] = React.useState<string | null>(null);

  const {
    data: submitImageResponseData,
  } = pluginApi.useDataChannel<SubmitImage>('submitImage', DataChannelTypes.ALL_ITEMS);

  const submittedImages = submitImageResponseData?.data || [];

  const userSubmittedImages = submittedImages
    .filter((item) => item.payloadJson.submittedBy.userId === currentUser.userId);

  const generatePhotoSessionUrl = async () => {
    const joinUrl = await pluginApi.getJoinUrl({
      enforceLayout: 'PRESENTATION_ONLY',
      sessionName: 'visualSubmitMobileCaptureSession',
      'userdata-bbb_hide_controls': 'true',
      'userdata-bbb_auto_join_audio': 'false',
      'userdata-bbb_auto_share_webcam': 'false',
      'userdata-bbb_show_session_details_on_join': 'false',
      'userdata-bbb_hide_notifications': 'true',
    });
    setPhotoSessionUrl(joinUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSubmitError(null);

      const url = URL.createObjectURL(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(url);
      setSelectedFile(file);
    }
  };

  const handleUserImageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleImageSubmit(e);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <Styled.UserContainer>
      <Styled.UserHeaderContainer>
        <Styled.UserTitle>Submit Visual Content</Styled.UserTitle>
        <Styled.QrCodeButton
          type="button"
          onClick={() => setIsModalOpen(true)}
          aria-label="Show QR Code for Mobile Camera"
          title="Show QR Code for Mobile Camera"
        >
          <QRCodeIcon />
        </Styled.QrCodeButton>
      </Styled.UserHeaderContainer>

      <Styled.UserFormContainer
        onSubmit={handleUserImageSubmit}
      >
        <Styled.UserFileInput
          type="file"
          name="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        {previewUrl && (
          <Styled.UserImagePreview src={previewUrl} alt="Preview" />
        )}

        {submitError && (
          <CommonStyled.ErrorMessage>
            {submitError}
          </CommonStyled.ErrorMessage>
        )}

        <Styled.UserSubmitButton
          type="submit"
          disabled={!selectedFile}
        >
          Submit Image
        </Styled.UserSubmitButton>
      </Styled.UserFormContainer>

      <QrCodeModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        photoSessionUrl={photoSessionUrl}
        generatePhotoSessionUrl={generatePhotoSessionUrl}
      />

      <Styled.UserSubmittedImagesContainer>
        <Styled.UserSubmittedImagesLabel>Your Submitted Images</Styled.UserSubmittedImagesLabel>
        {userSubmittedImages.length === 0 ? (
          <Styled.UserEmptySubmittedState>
            No images have been submitted yet.
          </Styled.UserEmptySubmittedState>
        ) : (
          <Styled.UserSubmittedImagesList>
            {userSubmittedImages.map((file, index) => {
              const { imageUrl } = file.payloadJson;

              return (
                <Styled.UserSubmittedImageItem key={file.entryId} style={{ marginBottom: '10px' }}>
                  <Styled.UserSubmittedImageThumbnail
                    src={imageUrl}
                    alt="Submitted image"
                    validationStatus={file.payloadJson.isCorrect}
                    onClick={() => handleViewFile(imageUrl, {
                      userId: currentUser.userId,
                      userName: currentUser.name,
                      imageIndex: index + 1,
                      totalImages: userSubmittedImages.length,
                    }, file.entryId)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleViewFile(imageUrl, {
                          userId: currentUser.userId,
                          userName: currentUser.name,
                          imageIndex: index + 1,
                          totalImages: userSubmittedImages.length,
                        }, file.entryId);
                      }
                    }}
                  />

                  <DefaultStyled.Info>
                    <DefaultStyled.Text style={{ marginTop: '5px' }}>
                      Submitted
                      {' '}
                      {formatUploadTime(new Date(file.createdAt))}
                    </DefaultStyled.Text>
                  </DefaultStyled.Info>

                  <Styled.UserActionButtons>
                    <CommonStyled.DeleteButton onClick={() => {
                      if (window.confirm('Are you sure you want to delete this image?')) {
                        deleteSubmitImage([file.entryId]);
                      }
                    }}
                    >
                      <TrashIcon />
                    </CommonStyled.DeleteButton>
                  </Styled.UserActionButtons>
                </Styled.UserSubmittedImageItem>
              );
            })}
          </Styled.UserSubmittedImagesList>
        )}
      </Styled.UserSubmittedImagesContainer>
    </Styled.UserContainer>
  );
}
