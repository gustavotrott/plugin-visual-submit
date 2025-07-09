import * as React from 'react';
import { CurrentUserData, DataChannelEntryResponseType } from 'bigbluebutton-html-plugin-sdk';
import * as Styled from './styles';
import * as DefaultStyled from '../shared/styles';
import { SubmitImage } from '../../visual-submit/types';
import { formatUploadTime } from '../../../utils/formatUploadTime';

interface UserSidekickAreaProps {
  handleSubmitImage: (imageUrl: string) => void;
  currentUser: CurrentUserData;
  submitImageResponseData: DataChannelEntryResponseType<SubmitImage>[];
}

export function UserSidekickArea({
  handleSubmitImage,
  currentUser,
  submitImageResponseData,
}: UserSidekickAreaProps): React.ReactElement {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = React.useState<string | null>(''); // only for testing
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const userSubmittedImages = submitImageResponseData
    .filter((item) => item.payloadJson.submittedBy.userId === currentUser.userId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = () => {
    if (selectedFile || selectedFileUrl) {
      handleSubmitImage?.(selectedFileUrl);
      setSelectedFile(null);
    }
  };

  // cleanup preview URL when component unmounts
  React.useEffect(() => () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  return (
    <Styled.UserContainer>
      <Styled.UserTitle>Submit Visual Content</Styled.UserTitle>

      <div
        style={{ position: 'relative' }}
      >
        <input
          style={{ width: '100%' }}
          type="text"
          onChange={(e) => setSelectedFileUrl(e.target.value)}
          value={selectedFileUrl}
        />
        <Styled.UserFileInput
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          placeholder="Submit an image file"
        />
        {previewUrl && (
          <Styled.UserImagePreview src={previewUrl} alt="Preview" />
        )}
      </div>

      <Styled.UserSubmitButton
        disabled={!selectedFile && !selectedFileUrl}
        onClick={handleSubmit}
      >
        Submit Image
      </Styled.UserSubmitButton>

      <Styled.UserSubmittedImagesContainer>
        <Styled.UserSubmittedImagesLabel>Submitted Images</Styled.UserSubmittedImagesLabel>
        {userSubmittedImages.length === 0 ? (
          <Styled.UserEmptySubmittedState>
            No images have been submitted yet.
          </Styled.UserEmptySubmittedState>
        ) : (
          <Styled.UserSubmittedImagesList>
            {userSubmittedImages.map((item) => {
              const { imageUrl } = item.payloadJson;

              return (
                <Styled.UserSubmittedImageItem key={item.entryId}>
                  <Styled.UserSubmittedImageThumbnail
                    src={imageUrl}
                    alt="Submitted image"
                  />
                  <DefaultStyled.Info>
                    <Styled.UserSubmittedImageTime>
                      Submitted
                      {' '}
                      {formatUploadTime(new Date(item.createdAt))}
                    </Styled.UserSubmittedImageTime>
                  </DefaultStyled.Info>
                  <Styled.UserSubmittedImageActions>
                    <Styled.UserSubmittedImageAction
                      className="view"
                      onClick={() => window.open(imageUrl, '_blank')}
                    >
                      View
                    </Styled.UserSubmittedImageAction>
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
