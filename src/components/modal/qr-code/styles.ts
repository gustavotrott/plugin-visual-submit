import styled from 'styled-components';

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
