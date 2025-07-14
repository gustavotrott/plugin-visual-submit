import styled from 'styled-components';
import { StatusMessage } from '../../styles/common';

export const Container = styled.div`
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

export const Title = styled.h1`
  color: white;
  font-size: 28px;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

export const CaptureSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  flex: 1;
  width: 100%;
  max-width: 400px;
`;

export const CameraButton = styled.button`
  background: white;
  border: none;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const SuccessMessage = styled(StatusMessage)`
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const Instructions = styled.p`
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 14px;
  line-height: 1.5;
  max-width: 300px;
  margin: 0;
`;
