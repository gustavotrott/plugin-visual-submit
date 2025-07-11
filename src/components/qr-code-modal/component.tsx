import * as React from 'react';
import QRCode from 'react-qr-code';
import * as Styled from './styles';

interface QrCodeModalProps {
  isOpen: boolean;
  handleCloseModal: () => void;
  photoSessionUrl: string | null;
  generatePhotoSessionUrl: () => void;
}

export function QrCodeModal({
  isOpen,
  handleCloseModal,
  photoSessionUrl = null,
  generatePhotoSessionUrl,
}: QrCodeModalProps): React.ReactElement {
  React.useEffect(() => {
    if (isOpen) {
      if (photoSessionUrl == null) {
        generatePhotoSessionUrl();
      }
    }
  }, [isOpen]);

  return (
    <Styled.PluginModal
      overlayClassName="modalOverlay"
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
    >
      <Styled.CloseButtonWrapper>
        <Styled.CloseButton
          type="button"
          onClick={() => {
            handleCloseModal();
          }}
          aria-label="Close button"
        >
          <i
            className="icon-bbb-close"
          />
        </Styled.CloseButton>
      </Styled.CloseButtonWrapper>
      {photoSessionUrl && (
        <Styled.ContentContainer>
          <Styled.Title>Mobile Photo Capture</Styled.Title>
          <Styled.QRCodeWrapper>
            <QRCode
              value={photoSessionUrl}
              size={200}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            />
          </Styled.QRCodeWrapper>
          <Styled.Description>
            <strong>Scan with your phone to take and submit photos</strong>
          </Styled.Description>
          <Styled.LinkContainer>
            <Styled.StyledLink
              href={photoSessionUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              link
            </Styled.StyledLink>
          </Styled.LinkContainer>
        </Styled.ContentContainer>
      )}
    </Styled.PluginModal>
  );
}
