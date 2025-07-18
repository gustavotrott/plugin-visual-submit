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
  display: flex;
  margin-bottom: 10px;
  flex-shrink: 0;
  justify-content: space-between;
  align-items: center;
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

export const PrintButton = styled.button`
  width: 50px;
  height: 50px;
  position: relative;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

export const PrintIcon = styled.span<{ clicked: boolean }>`
  position: relative;
  display: inline-block;
  padding: 0;
  margin-top: 20%;
  width: 60%;
  height: 35%;
  background-color: #fff;
  border-radius: 20% 20% 0 0;
  border: solid 4px #333;
  box-sizing: border-box;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 12%;
    right: 12%;
    background-color: #fff;
    box-sizing: border-box;
  }

  &::before {
    bottom: 100%;
    height: ${({ clicked }) => (clicked ? '0px' : '110%')};
    border: solid 4px #333;
    transition: height 0.2s;
  }

  &::after {
    top: 55%;
    height: ${({ clicked }) => (clicked ? '120%' : '0%')};
    border: solid ${({ clicked }) => (clicked ? '2px' : '4px')} #333;
    background-repeat: no-repeat;
    background-size: 70% 90%;
    background-position: center;
    background-image: linear-gradient(
      to top,
      #fff 0, #fff 14%,
      #333 14%, #333 28%,
      #fff 28%, #fff 42%,
      #333 42%, #333 56%,
      #fff 56%, #fff 70%,
      #333 70%, #333 84%,
      #fff 84%, #fff 100%
    );
    transition: 
      height 0.2s ${({ clicked }) => (clicked ? '0.15s' : '0s')}, 
      border-width 0s ${({ clicked }) => (clicked ? '0.16s' : '0.2s')}, 
      width 0s ${({ clicked }) => (clicked ? '0.16s' : '0.2s')};
  }
`;

export const TrashContainer = styled.div`
  margin: auto;
  height: 20px;
  width: 20px;
  cursor: pointer;
`;

export const Trash = styled.div`
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
`;

export const Tap = styled.div<{ isOpen: boolean }>`
  width: 100%;
  height: 15%;
  overflow: hidden;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(45deg) translate(0, -200%)' : 'rotate(0deg) translate(0)')};
  transition: transform ${({ isOpen }) => (isOpen ? '300ms' : '150ms')};
`;

// original trash color #95afc0
export const Tip = styled.div`
  background: #000;
  width: 15%;
  height: 30%;
  margin-left: auto;
  margin-right: auto;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
`;

export const Top = styled.div`
  background: #000;
  margin-top: 1%;
  width: 80%;
  height: 70%;
  margin-left: auto;
  margin-right: auto;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
`;

export const Tap2 = styled.div`
  width: 100%;
  height: 85%;
  overflow: hidden;
`;

export const Bottom = styled.div`
  background: #000;
  width: 70%;
  height: 98%;
  margin-top: 2%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: space-around;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
`;

export const Line = styled.div`
  margin: auto;
  background-color: white;
  height: 70%;
  width: 2px;
`;
