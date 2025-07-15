import styled from 'styled-components';

export const Title = styled.h2`
  color: #333;
  margin-top: 20px;
`;

export const Thumbnail = styled.img`
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid #e9ecef;
`;

export const ListItem = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Info = styled.div`
  flex: 1;
`;

export const Actions = styled.div`
  display: flex;
`;

export const ActionButton = styled.button`
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &.view {
    background: #28a745;
    color: white;
  }
  
  &.delete {
    background: #dc3545;
    color: white;
  }
  
  &:hover {
    opacity: 0.8;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  background: white;
  border-radius: 8px;
  border: 2px solid #ddd;
`;

export const Text = styled.div`
  color: #333;
  font-size: 14px;
`;

export const SubText = styled.div`
  color: #666;
  font-size: 12px;
`;
