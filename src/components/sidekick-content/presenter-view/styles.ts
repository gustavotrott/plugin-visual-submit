import styled from 'styled-components';
import {
  Container,
  Title,
  Thumbnail,
  ListItem,
  List,
  Actions,
  EmptyState,
} from '../shared/styles';

export const PresenterContainer = styled(Container)`
  max-width: 600px;
`;

export const PresenterTitle = styled(Title)`
  margin-bottom: 20px;
  font-size: 20px;
`;

export const PresenterFilesList = styled(List)`
  gap: 15px;
`;

export const PresenterFileItem = styled(ListItem)`
  padding: 15px;
  gap: 15px;
`;

export const PresenterFileImage = styled(Thumbnail)`
  width: 80px;
  height: 80px;
`;

export const PresenterFileType = styled.span`
  background: #e7f3ff;
  color: #0066cc;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
`;

export const PresenterActionButtons = styled(Actions)`
  gap: 8px;
`;

export const PresenterEmptyState = styled(EmptyState)`
  padding: 40px 20px;
`;

export const PresenterUserHeader = styled.div`
  background: #f5f5f5;
  padding: 10px;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #e0e0e0;
  font-weight: bold;
  color: #333;
`;

export const PresenterUserImagesContainer = styled.div`
  background: #fafafa;
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 10px;
`;

export const PresenterFilterContainer = styled.div`
  margin-bottom: 10px;
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
`;
