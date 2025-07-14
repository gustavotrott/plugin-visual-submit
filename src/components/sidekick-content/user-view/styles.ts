import styled from 'styled-components';
import {
  Container,
  Title,
  Thumbnail,
  ListItem,
  List,
  Actions,
  EmptyState,
  Text,
} from '../shared/styles';

export const UserContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 400px;
`;

export const UserTitle = styled(Title)`
  font-size: 18px;
`;

export const UserFileInput = styled.input`
  width: 100%;
  padding: 20px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  background: #f8f9fa;
  cursor: pointer;
  font-size: 14px;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: #007bff;
    background: #e3f2fd;
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.1);
  }

  &:focus {
    outline: none;
    border-color: #007bff;
    background: #e3f2fd;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

export const UserImagePreview = styled(Thumbnail)`
  width: 100%;
  height: 100%;
  margin-top: 10px;
`;

export const UserSubmitButton = styled.button`
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #0056b3;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

export const UserSubmittedImagesContainer = styled.div`
  border-top: 1px solid #ddd;
`;

export const UserSubmittedImagesLabel = styled.h3`
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
  font-weight: 500;
`;

export const UserSubmittedImagesList = styled(List)`
  gap: 10px;
`;

export const UserSubmittedImageItem = styled(ListItem)`
  padding: 12px;
  gap: 12px;
`;

export const UserSubmittedImageThumbnail = styled(Thumbnail)`
  width: 60px;
  height: 60px;
`;

export const UserSubmittedImageTime = styled(Text)`
  font-weight: 500;
  margin-bottom: 4px;
`;

export const UserSubmittedImageActions = styled(Actions)`
  gap: 6px;
`;

export const UserEmptySubmittedState = styled(EmptyState)`
  padding: 20px;
  font-size: 14px;
`;

export const QrCodeButton = styled.button`
  width: 40px;
  height: 40px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #5a6268;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(108, 117, 125, 0.25);
  }
`;
