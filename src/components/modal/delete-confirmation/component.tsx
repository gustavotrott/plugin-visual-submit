import * as React from 'react';
import { Modal } from '../component';
import * as Styled from './styles';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Delete Image',
  message = 'Are you sure you want to delete this image? This action cannot be undone.',
}: DeleteConfirmationModalProps): React.ReactElement {
  const handleConfirm = React.useCallback(() => {
    onConfirm();
    onCancel(); // Close the modal and reset states after confirming
  }, [onConfirm, onCancel]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      size="default"
      title={title}
    >
      <Styled.Container>
        <Styled.Message>{message}</Styled.Message>
        <Styled.ButtonContainer>
          <Styled.CancelButton onClick={onCancel}>
            Cancel
          </Styled.CancelButton>
          <Styled.DeleteButton onClick={handleConfirm}>
            Delete Image
          </Styled.DeleteButton>
        </Styled.ButtonContainer>
      </Styled.Container>
    </Modal>
  );
}

DeleteConfirmationModal.defaultProps = {
  title: 'Delete Image',
  message: 'Are you sure you want to delete this image? This action cannot be undone.',
};
