import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Message = styled.p`
  margin: 0;
  color: #333;
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const BaseButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline-offset: 2px;
  }
`;

export const CancelButton = styled(BaseButton)`
  background-color: #ffffff;
  border-color: #ddd;
  color: #333;

  &:hover {
    background-color: #f5f5f5;
    border-color: #ccc;
  }

  &:focus {
    outline: 2px solid #007bff;
  }
`;

export const DeleteButton = styled(BaseButton)`
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;

  &:hover {
    background-color: #c82333;
    border-color: #bd2130;
  }

  &:focus {
    outline: 2px solid #dc3545;
  }
`;
