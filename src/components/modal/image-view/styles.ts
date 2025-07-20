import styled from 'styled-components';

export const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 300px;
  max-height: 60vh;
  padding: 0;
  margin: 0;
  flex-shrink: 0;
  position: relative;
`;

export const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 12px;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  
  ${ImageContainer}:hover & {
    opacity: 1;
    pointer-events: auto;
  }
`;

export const OpenInNewTabButton = styled.button`
  background: rgba(0, 0, 0, 0.7);
  opacity: 0.7;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
  
  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
`;

export const Image = styled.img<{
  validationStatus?: boolean | null;
  isPresenter?: boolean;
}>`
  max-width: 90%;
  max-height: 40vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  ${({ isPresenter, validationStatus }) => {
    if (!isPresenter && validationStatus !== null && validationStatus !== undefined) {
      return `
        border: 4px solid ${validationStatus === false ? '#dc3545' : '#28a745'};
        transition: border-color 0.2s ease;
      `;
    }
    return ''; // No border for presenters or unvalidated images
  }}
`;

export const PresenterControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border-radius: 0 0 8px 8px;
  flex-shrink: 0;
`;

export const SubmissionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SubmissionLabel = styled.span`
  font-weight: 600;
  color: #333;
`;

export const SubmissionUser = styled.span`
  color: #666;
  font-style: italic;
`;

export const ValidationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ValidationLabel = styled.h4`
  margin: 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
`;

export const ValidationButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

export const ValidationButton = styled.button<{ variant: 'correct' | 'incorrect'; isSelected?: boolean }>`
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: transparent;
  
  ${(props) => props.variant === 'correct' && `
    border-color: #28a745;
    color: #28a745;
    
    ${props.isSelected ? `
      background-color: #28a745;
      color: white;
    ` : `
      &:hover {
        border-color: #218838;
        color: #218838;
      }
    `}
  `}
  
  ${(props) => props.variant === 'incorrect' && `
    border-color: #dc3545;
    color: #dc3545;
    
    ${props.isSelected ? `
      background-color: #dc3545;
      color: white;
    ` : `
      &:hover {
        border-color: #c82333;
        color: #c82333;
      }
    `}
  `}
`;export const FeedbackSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FeedbackLabel = styled.h4`
  margin: 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
`;

export const ExistingFeedback = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
`;

export const ExistingFeedbackLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 4px;
`;

export const ExistingFeedbackText = styled.div`
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  word-wrap: break-word;
`;

export const FeedbackInput = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  resize: none;
  min-height: 60px;
  max-height: 120px;

  &::placeholder {
    color: #999;
    opacity: 1;
  }

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export const FeedbackButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-end;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;
