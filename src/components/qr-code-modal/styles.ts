import * as ReactModal from 'react-modal';
import styled from 'styled-components';

// This is required for accessibility reasons.
// You can alternatively set it on your root app component during app initialization.
ReactModal.setAppElement('#app'); // Adjust '#root' to match your application's mount node ID.

export const PluginModal = styled(ReactModal)`
  position: relative;
  z-index: 1000 !important;
  outline: transparent;
  outline-width: 2px;
  outline-style: solid;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.7);
  background-color: #fff !important;
  max-width: 60vw;
  max-height: 80vh;
  border-radius: 0.2rem;
  overflow: auto;
  overflow-y: hidden;
  background-repeat: no-repeat;
  background-color: transparent;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  background-attachment: local, local, scroll, scroll;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-button {
    width: 0;
    height: 0;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.25);
    border: none;
    border-radius: 50px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.5);
  }
  &::-webkit-scrollbar-thumb:active {
    background: rgba(0, 0, 0, 0.25);
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.25);
    border: none;
    border-radius: 50px;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }

  @media only screen and (max-width: 40em) {
    max-width: 95vw;
  }

  @media only screen and (min-width: 40.063em) {
    max-width: 80vw;
  }
`;

export const CloseButton = styled.button`
  font-size: 40px;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  border: none;
  &:hover {
    background-color: #EEE;
  }
`;

export const CloseButtonWrapper = styled.div`
  width: 100%;
  align-items: flex-end;
  display: flex;
  flex-direction: column; 
`;

export const ContentContainer = styled.div`
  text-align: center;
  padding: 20px;
`;

export const Title = styled.h2`
  color: #333;
  margin: 0 0 20px 0;
`;

export const QRCodeWrapper = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  display: inline-block;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const StyledQRCode = styled.div`
  height: auto;
  max-width: 100%;
  width: 100%;
`;

export const Description = styled.p`
  margin-top: 20px;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
`;

export const LinkContainer = styled.div`
  margin-top: 15px;
  padding: 10px;
  background-color: #e8f5e8;
  border-radius: 4px;
  font-size: 12px;
  color: #2d5a2d;
  word-break: break-all;
  border: 1px solid #c3e6c3;
`;

export const StyledLink = styled.a`
  color: #2d5a2d;
  text-decoration: underline;
`;
