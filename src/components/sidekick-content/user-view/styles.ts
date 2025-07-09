import styled from 'styled-components';
import {
  Container,
  Title,
  Thumbnail,
  ListItem,
  List,
  Actions,
  ActionButton,
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
  margin-bottom: 10px;
  font-size: 18px;
`;

export const UserFileInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px dashed #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  
  &:hover {
    border-color: #007bff;
  }
`;

export const UserImagePreview = styled(Thumbnail)`
  width: 80px;
  height: 80px;
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
  margin-top: 15px;
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

export const UserSubmittedImageAction = styled(ActionButton)`
  padding: 4px 8px;
  font-size: 11px;
`;

export const UserEmptySubmittedState = styled(EmptyState)`
  padding: 20px;
  font-size: 14px;
`;
