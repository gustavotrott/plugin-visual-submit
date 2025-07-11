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

interface UserSidekickAreaProps {
  pluginApi: PluginApi;
  currentUser: CurrentUserData;
  submitError: string | null;
  submitSuccess: boolean;
  setSubmitError: React.Dispatch<React.SetStateAction<string | null>>;
  handleImageSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  submitImageResponseData: DataChannelEntryResponseType<SubmitImage>[];
}

export function UserSidekickArea({
  pluginApi,
  currentUser,
  submitError,
  submitSuccess,
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
      'userdata-is_mobile_capture': '1',
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
      <Styled.UserTitle>Submit Visual Content</Styled.UserTitle>

      <form
        onSubmit={handleImageSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Styled.UserFileInput
            type="file"
            name="file"
            accept="image/*"
            onChange={handleFileChange}
            placeholder="Submit an image file"
          />
          <Styled.QrCodeButton
            type="button"
            onClick={() => setIsModalOpen(true)}
            aria-label="Show QR Code for Mobile Camera"
            title="Show QR Code for Mobile Camera"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm10-2h6v6h-6V3zm2 2v2h2V5h-2zM3 15h6v6H3v-6zm2 2v2h2v-2H5zm6-14h2v2h-2V3zm0 4h2v2h-2V7zm4 4h2v2h-2v-2zm-4 0h2v2h-2v-2zm0 4h2v2h-2v-2zm4 4h2v2h-2v-2z" />
            </svg>
          </Styled.QrCodeButton>
        </div>

        {previewUrl && (
          <Styled.UserImagePreview src={previewUrl} alt="Preview" />
        )}

        {submitError && (
          <CommonStyled.ErrorMessage>
            {submitError}
          </CommonStyled.ErrorMessage>
        )}

        {submitSuccess && (
          <CommonStyled.SuccessMessage>
            Image uploaded successfully!
          </CommonStyled.SuccessMessage>
        )}

        <Styled.UserSubmitButton
          type="submit"
          disabled={!selectedFile}
        >
          Submit Image
        </Styled.UserSubmitButton>
      </form>

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
                  />
                  <DefaultStyled.Info>
                    <Styled.UserSubmittedImageTime>
                      Submitted
                      {' '}
                      {formatUploadTime(new Date(file.createdAt))}
                    </Styled.UserSubmittedImageTime>
                  </DefaultStyled.Info>
                  <Styled.UserSubmittedImageActions>
                    <CommonStyled.ActionButton
                      className="view"
                      onClick={() => handleViewFile(imageUrl)}
                    >
                      View
                    </CommonStyled.ActionButton>
                  </Styled.UserSubmittedImageActions>
                </Styled.UserSubmittedImageItem>
              );
            })}
          </Styled.UserSubmittedImagesList>
        )}
      </Styled.UserSubmittedImagesContainer>
    </Styled.UserContainer>
  );
}
