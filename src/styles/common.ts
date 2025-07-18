import styled from 'styled-components';

export const StatusMessage = styled.span`
  font-size: 14px;
  text-align: center;
  padding: 8px;
  border-radius: 4px;
  display: inline-block;
`;

export const ErrorMessage = styled(StatusMessage)`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
`;

export const LoadingMessage = styled(StatusMessage)`
  color: #856404;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
`;

export const LoadingSpinner = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #856404;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 8px;
  vertical-align: middle;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const ActionButton = styled.button`
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 6px 12px;
  font-size: 12px;
  
  &.view {
    background: #28a745;
    color: white;
  }
  
  &.delete {
    background: transparent;
    color: #6c757d;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      color: #dc3545;
    }
  }
  
  &:hover {
    opacity: 0.8;
  }
  
  &.delete:hover {
    opacity: 1;
  }
`;
