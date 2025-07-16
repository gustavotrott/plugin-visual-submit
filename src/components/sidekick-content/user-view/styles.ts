import styled from 'styled-components';
import {
  Thumbnail,
  Text,
  BaseContainer,
  ScrollableList,
  ClickableThumbnail,
  ResponsiveTitle,
  MobileEmptyState,
  MobileListItem,
} from '../shared/styles';

export const UserContainer = styled(BaseContainer)`
  gap: 15px;
  max-width: 400px;
  padding-right: 10px;
`;

export const UserTitle = styled(ResponsiveTitle)`
  font-size: 18px;
  
  @media (max-height: 600px) {
    font-size: 16px;
    margin-bottom: 0;
  }
`;

export const UserFormContainer = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0; /* Prevent form from shrinking on mobile */
  
  @media (max-height: 600px) {
    gap: 8px;
  }
`;

export const UserHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  
  @media (max-height: 600px) {
    margin-bottom: 5px;
  }
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
  
  @media (max-height: 600px) {
    padding: 15px;
    font-size: 13px;
  }
`;

export const UserImagePreview = styled(Thumbnail)`
  width: 100%;
  height: 100%;
  margin-top: 10px;
  
  @media (max-height: 600px) {
    max-height: 120px;
    object-fit: cover;
    margin-top: 5px;
  }
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
  flex: 1;
  min-height: 0; /* Allow flex item to shrink */
  
  /* On mobile, limit the height of submitted images to ensure form is always visible */
  @media (max-height: 600px) {
    display: flex;
    flex-direction: column;
    max-height: 300px;
  }
`;

export const UserSubmittedImagesLabel = styled.h3`
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  flex-shrink: 0;
  
  @media (max-height: 600px) {
    font-size: 14px;
    margin-bottom: 10px;
    margin-top: 10px;
  }
`;

export const UserSubmittedImagesList = styled(ScrollableList)`
  gap: 10px;
  
  /* Mobile-specific scrolling for image list */
  @media (max-height: 600px) {
    max-height: 200px;
  }
`;

export const UserSubmittedImageItem = styled(MobileListItem)`
  padding: 12px;
  gap: 12px;
`;

export const UserSubmittedImageThumbnail = styled(ClickableThumbnail)`
  width: 60px;
  height: 60px;
`;

export const UserSubmittedImageTime = styled(Text)`
  font-weight: 500;
  margin-bottom: 4px;
`;

export const UserEmptySubmittedState = styled(MobileEmptyState)`
  font-size: 14px;
  
  @media (max-height: 600px) {
    font-size: 13px;
  }
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
  flex-shrink: 0;
  
  &:hover {
    background: #5a6268;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(108, 117, 125, 0.25);
  }
  
  @media (max-height: 600px) {
    width: 35px;
    height: 35px;
    font-size: 14px;
  }
`;
