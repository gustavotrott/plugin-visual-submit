import type { DataChannelEntryResponseType } from 'bigbluebutton-html-plugin-sdk';
import type { SubmitImage } from '../components/visual-submit/types';

interface UserGroup {
  user: { userId: string; userName: string; };
  images: DataChannelEntryResponseType<SubmitImage>[];
}

export const handlePrintSubmissions = (groupedImages: UserGroup[]): void => {
  const myFrame = document.createElement('IFRAME') as HTMLIFrameElement;
  myFrame.style.zIndex = '-1';
  document.body.appendChild(myFrame);

  const doc = myFrame.contentDocument;
  if (!doc) return;

  const { body } = doc;

  body.style.backgroundColor = 'white';
  body.style.fontFamily = 'Arial, sans-serif';
  body.style.margin = '0';
  body.style.padding = '1rem';

  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.tableLayout = 'auto';
  table.style.margin = '0 auto';
  table.style.textAlign = 'center';

  const usersWithImages = groupedImages.filter((group) => group.images.length > 0);
  const usersWithoutImages = groupedImages.filter((group) => group.images.length === 0);

  usersWithImages
    .sort((a, b) => {
      // 1. Compare user names
      const nameCompare = a.user.userName.localeCompare(b.user.userName);
      if (nameCompare !== 0) return nameCompare;

      // 2. Compare number of images
      const imageCountCompare = a.images.length - b.images.length;
      if (imageCountCompare !== 0) return imageCountCompare;

      // 3. Compare oldest image timestamp
      const aOldest = new Date(a.images[0]?.createdAt || 0).getTime();
      const bOldest = new Date(b.images[0]?.createdAt || 0).getTime();
      return aOldest - bOldest;
    })
    .concat(usersWithoutImages)
    .forEach((userGroup, index) => {
      const row = document.createElement('tr');
      row.style.breakInside = 'avoid'; // Prevent page breaks inside the row

      // Add page break before every row except the first one
      if (index !== 0) {
        row.style.pageBreakBefore = 'always'; // old browsers
        row.style.breakBefore = 'page'; // modern spec
      }

      // Cell 1: User name
      const userCell = document.createElement('td');
      userCell.style.fontWeight = 'bold';
      userCell.style.padding = '0.5rem';
      userCell.style.verticalAlign = 'top';
      const imageCount = userGroup.images.length;
      userCell.innerHTML = `${userGroup.user.userName} <br/> ${imageCount} ${imageCount === 1 ? 'image' : 'images'}`;
      row.appendChild(userCell);

      // Cell 2: All images stacked vertically
      const imagesCell = document.createElement('td');
      imagesCell.style.padding = '0.5rem';
      imagesCell.style.verticalAlign = 'top';
      imagesCell.style.textAlign = 'center';
      imagesCell.style.display = 'inline-block';

      userGroup.images
        .sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
        .forEach((file) => {
          const { imageUrl } = file.payloadJson;
          const img = document.createElement('img');
          img.src = imageUrl;
          img.style.display = 'block';
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          img.style.maxHeight = '400px';
          img.style.marginBottom = '0.5rem';
          imagesCell.appendChild(img);
        });

      row.appendChild(imagesCell);
      table.appendChild(row);
    });

  body.appendChild(table);

  setTimeout(() => {
    myFrame.focus();
    myFrame.contentWindow?.print();
    if (myFrame.parentNode) {
      myFrame.parentNode.removeChild(myFrame);
    }
  }, 500); // wait for images to load

  window.focus();
};
