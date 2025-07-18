import * as React from 'react';
import QRCode from 'react-qr-code';
import { Modal } from '../component';
import * as Styled from './styles';

interface QrCodeModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  photoSessionUrl: string | null;
  generatePhotoSessionUrl: () => void;
}

export function QrCodeModal({
  isOpen,
  onRequestClose,
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
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      title="Mobile Photo Capture"
    >
      {photoSessionUrl && (
        <>
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
        </>
      )}
    </Modal>
  );
}
