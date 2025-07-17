import styled from 'styled-components';
import {
  Actions,
  ScrollableList,
  ClickableThumbnail,
  ResponsiveTitle,
  MobileEmptyState,
  MobileListItem,
} from '../shared/styles';

export const PresenterTitle = styled(ResponsiveTitle)`
  font-size: 20px;
  
  @media (max-height: 600px) {
    font-size: 18px;
  }
`;

export const PresenterFilesList = styled(ScrollableList)`
  gap: 15px;
  
  @media (max-height: 600px) {
    max-height: 400px;
  }
`;

export const PresenterFileItem = styled(MobileListItem)`
  gap: 15px;
`;

export const PresenterFileImage = styled(ClickableThumbnail)`
  width: 80px;
  height: 80px;
`;

export const PresenterActionButtons = styled(Actions)`
  gap: 8px;
`;

export const PresenterEmptyState = styled(MobileEmptyState)`
`;

export const PresenterUserHeader = styled.div`
  margin: 10px 0px;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #e0e0e0;
  font-weight: bold;
  color: #333;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  
  @media (max-height: 600px) {
    margin: 8px;
    font-size: 14px;
  }
`;

export const PresenterUserImagesContainer = styled.div`
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 10px;
  
  @media (max-height: 600px) {
    padding: 8px;
  }
`;

export const PresenterFilterContainer = styled.div`
  margin-bottom: 10px;
  flex-shrink: 0;
  
  @media (max-height: 600px) {
    margin-bottom: 8px;
  }
`;

export const PresenterUserFilterSelect = styled.select`
  padding: 5px 10px;
  margin-right: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: white;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    border-color: #007bff;
  }
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
  
  @media (max-height: 600px) {
    padding: 4px 8px;
    font-size: 13px;
    margin-right: 8px;
  }
`;
