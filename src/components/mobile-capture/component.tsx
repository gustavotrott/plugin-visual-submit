import * as React from 'react';
import * as Styled from './styles';
import * as CommonStyled from '../../styles/common';
import { CameraIcon } from '../../utils/icons';

interface MobileCaptureProps {
  onImageCapture: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  submitError: string | null;
  submitSuccess: boolean;
}

export function MobileCapture({
  onImageCapture,
  submitError,
  submitSuccess,
}: MobileCaptureProps): React.ReactElement {
  const [isLoading, setIsLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setIsLoading(true);

      // Auto-submit the form when a file is selected
      if (formRef.current) {
        // Trigger form submission programmatically
        formRef.current.requestSubmit();
      }
    }
  };

  const handleImageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      await onImageCapture(e);
    } finally {
      setIsLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCameraButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Title>Submit Photo</Styled.Title>
      </Styled.Header>

      <form ref={formRef} onSubmit={handleImageSubmit}>
        <Styled.CaptureSection>
          <Styled.CameraButton
            type="button"
            onClick={handleCameraButtonClick}
            disabled={isLoading}
          >
            <CameraIcon />
          </Styled.CameraButton>

          {isLoading && (
            <CommonStyled.LoadingMessage>
              Uploading
              <CommonStyled.LoadingSpinner />
            </CommonStyled.LoadingMessage>
          )}

          {submitError && (
            <CommonStyled.ErrorMessage>
              {submitError}
            </CommonStyled.ErrorMessage>
          )}

          {submitSuccess && (
            <Styled.SuccessMessage>
              Image uploaded successfully!
            </Styled.SuccessMessage>
          )}

          <Styled.HiddenFileInput
            ref={fileInputRef}
            type="file"
            name="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
          />

          <Styled.Instructions>
            Tap the button above to open your camera and take a photo
          </Styled.Instructions>
        </Styled.CaptureSection>
      </form>
    </Styled.Container>
  );
}
