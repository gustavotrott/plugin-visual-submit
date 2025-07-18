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

// Mobile scrolling mixins and shared styles
export const scrollingStyles = `
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
  scrollbar-color: #ccc transparent;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 2px;
  }
`;

export const mobileContainerStyles = `
  @media (max-height: 600px) {
    max-height: 100vh;
    padding-bottom: 20px;
  }
`;

// Shared container for both user and presenter views
export const BaseContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  
  ${scrollingStyles}
  ${mobileContainerStyles}
`;

// Shared scrollable list for both views
export const ScrollableList = styled(List)`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  
  ${scrollingStyles}
  
  @media (max-height: 600px) {
    gap: 10px;
  }
`;

// Shared clickable thumbnail with mobile optimizations
export const ClickableThumbnail = styled(Thumbnail)`
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  flex-shrink: 0;
  
  &:hover, &:focus {
    /* transform: scale(1.05); */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    border-color: #007bff;
  }
  
  &:focus {
    outline: none;
  }
  
  @media (max-height: 600px) {
    width: 60px;
    height: 60px;
  }
`;

// Shared responsive title
export const ResponsiveTitle = styled(Title)`
  flex-shrink: 0;
  
  @media (max-height: 600px) {
    margin-top: 10px;
    margin-bottom: 10px;
  }
`;

// Shared mobile-optimized empty state
export const MobileEmptyState = styled(EmptyState)`
  padding: 20px;
  
  @media (max-height: 600px) {
    padding: 15px;
    font-size: 14px;
  }
`;

// Shared mobile-optimized list item
export const MobileListItem = styled(ListItem)`
  @media (max-height: 600px) {
    padding: 12px;
    gap: 12px;
  }
`;
