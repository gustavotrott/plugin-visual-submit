import * as React from 'react';
import {
  CurrentUserData, DataChannelEntryResponseType, PluginApi,
} from 'bigbluebutton-html-plugin-sdk';
import * as Styled from './styles';
import * as DefaultStyled from '../shared/styles';
import * as CommonStyled from '../../../styles/common';
import { SubmitImage } from '../../visual-submit/types';
import { formatUploadTime } from '../../../utils/formatUploadTime';
import { QrCodeModal } from '../../qr-code-modal/component';
import { QRCodeIcon } from '../../../utils/icons';

interface UserSidekickAreaProps {
  pluginApi: PluginApi;
  currentUser: CurrentUserData;
  submitError: string | null;
  setSubmitError: React.Dispatch<React.SetStateAction<string | null>>;
  handleImageSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  submitImageResponseData: DataChannelEntryResponseType<SubmitImage>[];
}

export function UserSidekickArea({
  pluginApi,
  currentUser,
  submitError,
  setSubmitError,
  handleImageSubmit,
  submitImageResponseData,
}: UserSidekickAreaProps): React.ReactElement {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [photoSessionUrl, setPhotoSessionUrl] = React.useState<string | null>(null);

  const userSubmittedImages = submitImageResponseData
    .filter((item) => item.payloadJson.submittedBy.userId === currentUser.userId);

  const generatePhotoSessionUrl = async () => {
    const joinUrl = await pluginApi.getJoinUrl({
      enforceLayout: 'PRESENTATION_ONLY',
      sessionName: 'visualSubmitMobileCaptureSession',
      'userdata-bbb_hide_controls': 'true',
      'userdata-bbb_auto_join_audio': 'false',
      'userdata-bbb_auto_share_webcam': 'false',
      'userdata-bbb_show_session_details_on_join': 'false',
    });
    setPhotoSessionUrl(joinUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSubmitError(null);
    }
  };

  // Cleanup preview URL when component unmounts
  React.useEffect(() => () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  const handleViewFile = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
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
        onSubmit={handleImageSubmit}
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
        handleCloseModal={() => setIsModalOpen(false)}
        photoSessionUrl={photoSessionUrl}
        generatePhotoSessionUrl={generatePhotoSessionUrl}
      />

      <Styled.UserSubmittedImagesContainer>
        <Styled.UserSubmittedImagesLabel>Submitted Images</Styled.UserSubmittedImagesLabel>
        {userSubmittedImages.length === 0 ? (
          <Styled.UserEmptySubmittedState>
            No images have been submitted yet.
          </Styled.UserEmptySubmittedState>
        ) : (
          <Styled.UserSubmittedImagesList>
            {userSubmittedImages.map((file) => {
              const { imageUrl } = file.payloadJson;

              return (
                <Styled.UserSubmittedImageItem key={file.entryId}>
                  <Styled.UserSubmittedImageThumbnail
                    src={imageUrl}
                    alt="Submitted image"
                    onClick={() => handleViewFile(imageUrl)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleViewFile(imageUrl);
                      }
                    }}
                  />
                  <DefaultStyled.Info>
                    <Styled.UserSubmittedImageTime>
                      Submitted
                      {' '}
                      {formatUploadTime(new Date(file.createdAt))}
                    </Styled.UserSubmittedImageTime>
                  </DefaultStyled.Info>
                </Styled.UserSubmittedImageItem>
              );
            })}
          </Styled.UserSubmittedImagesList>
        )}
      </Styled.UserSubmittedImagesContainer>
    </Styled.UserContainer>
  );
}
