import * as React from 'react';
import { DataChannelEntryResponseType, DeleteEntryFunction, RESET_DATA_CHANNEL } from 'bigbluebutton-html-plugin-sdk';
import * as Styled from './styles';
import * as DefaultStyled from '../shared/styles';
import * as CommonStyled from '../../../styles/common';
import { SubmitImage } from '../../visual-submit/types';
import { formatUploadTime } from '../../../utils/formatUploadTime';
import { TrashIcon } from '../../../utils/icons';

interface PresenterSidekickAreaProps {
  submittedImages: DataChannelEntryResponseType<SubmitImage>[];
  deleteSubmitImage: DeleteEntryFunction;
}

interface TrashIconProps {
  isOpen: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

function TrashButtonIcon({ isOpen, onClick }: TrashIconProps) {
  return (
    <Styled.TrashContainer onClick={onClick}>
      <Styled.Trash>
        <Styled.Tap isOpen={isOpen}>
          <Styled.Tip />
          <Styled.Top />
        </Styled.Tap>
        <Styled.Tap2>
          <Styled.Bottom>
            <Styled.Line />
            <Styled.Line />
            <Styled.Line />
          </Styled.Bottom>
        </Styled.Tap2>
      </Styled.Trash>
    </Styled.TrashContainer>
  );
}

export function PresenterSidekickArea({
  submittedImages,
  deleteSubmitImage,
}: PresenterSidekickAreaProps): React.ReactElement {
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const [printClicked, setPrintClicked] = React.useState(false);
  const [clearAllClicked, setClearAllClicked] = React.useState(false);

  const uniqueUsers = React.useMemo(() => {
    const users = new Map<string, { userId: string; userName: string; }>();
    submittedImages.forEach((image) => {
      const { submittedBy } = image.payloadJson;
      if (!users.has(submittedBy.userId)) {
        users.set(submittedBy.userId, submittedBy);
      }
    });
    return Array.from(users.values());
  }, [submittedImages]);

  // Filter images by selected user
  const filteredImages = React.useMemo(() => {
    if (!selectedUserId) return submittedImages;
    return submittedImages.filter((image) => (
      image.payloadJson.submittedBy.userId === selectedUserId
    ));
  }, [submittedImages, selectedUserId]);

  // Group images by user
  const groupedImages = React.useMemo(() => {
    const groups = new Map<string, {
      user: { userId: string; userName: string; };
      images: DataChannelEntryResponseType<SubmitImage>[];
    }>();

    filteredImages.forEach((image) => {
      const { submittedBy } = image.payloadJson;
      if (!groups.has(submittedBy.userId)) {
        groups.set(submittedBy.userId, {
          user: submittedBy,
          images: [],
        });
      }
      groups.get(submittedBy.userId)!.images.push(image);
    });

    return Array.from(groups.values());
  }, [filteredImages]);

  const handleViewFile = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  return (
    <DefaultStyled.BaseContainer>
      <Styled.PresenterTitle>
        Submitted Visual Content
        {' '}
        {filteredImages.length > 0 && `(${filteredImages.length})`}
      </Styled.PresenterTitle>

      {uniqueUsers.length > 0 && (
        <Styled.PresenterFilterContainer>
          <TrashButtonIcon
            isOpen={clearAllClicked}
            onClick={() => {
              setClearAllClicked(true);
              // Wait a bit to animation to be shown
              setTimeout(() => {
                if (window.confirm('Are you sure you want to clear all submitted images?')) {
                  // Reset the data channel to clear all images
                  deleteSubmitImage([RESET_DATA_CHANNEL]);
                }
                setTimeout(() => {
                  setClearAllClicked(false);
                }, 500);
              }, 200);
            }}
          />
          <Styled.PresenterUserFilterSelect
            value={selectedUserId || ''}
            onChange={(e) => setSelectedUserId(e.target.value || null)}
          >
            <option value="">All Users</option>
            {uniqueUsers.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.userName}
              </option>
            ))}
          </Styled.PresenterUserFilterSelect>
          <Styled.PrintButton
            type="button"
            disabled={printClicked}
            onClick={() => {
              setPrintClicked(true);
              const myframe = document.createElement('IFRAME') as HTMLIFrameElement;
              myframe.style.zIndex = '-1';
              document.body.appendChild(myframe);

              const doc = myframe.contentDocument;
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

              groupedImages
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
                .forEach((userGroup, index) => {
                  const row = document.createElement('tr');
                  row.style.breakInside = 'avoid'; // Prevent page breaks inside the row
                  // ✅ Add page break before every row except the first one
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
                      (a, b) => new Date(a.createdAt).getTime()
                        - new Date(b.createdAt).getTime(),
                    )
                    .forEach((file) => {
                      const { imageUrl } = file.payloadJson;
                      const img = document.createElement('img');
                      img.src = imageUrl;
                      img.style.display = 'inline-block';
                      img.style.maxWidth = '100%';
                      img.style.height = 'auto';
                      img.style.maxHeight = '400px';
                      img.style.display = 'block';
                      img.style.marginBottom = '0.5rem';
                      imagesCell.appendChild(img);
                    });

                  row.appendChild(imagesCell);
                  table.appendChild(row);
                });

              body.appendChild(table);

              setTimeout(() => {
                myframe.focus();
                myframe.contentWindow.print();
                myframe.parentNode.removeChild(myframe);
                setPrintClicked(false);
              }, 500); // wait for images to load
              window.focus();
            }}
          >
            <Styled.PrintIcon clicked={printClicked} />
          </Styled.PrintButton>
        </Styled.PresenterFilterContainer>
      )}

      {filteredImages.length === 0 ? (
        <Styled.PresenterEmptyState>
          No files have been submitted yet.
        </Styled.PresenterEmptyState>
      ) : (
        <Styled.PresenterFilesList>
          {groupedImages.map((userGroup) => (
            <div key={userGroup.user.userId}>
              <Styled.PresenterUserHeader>
                {userGroup.user.userName}
                {' - '}
                {userGroup.images.length}
                {' '}
                {userGroup.images.length === 1 ? 'image' : 'images'}
              </Styled.PresenterUserHeader>

              <Styled.PresenterUserImagesContainer>
                {userGroup.images.map((file) => {
                  const { imageUrl } = file.payloadJson;

                  return (
                    <Styled.PresenterFileItem key={file.entryId} style={{ marginBottom: '10px' }}>
                      <Styled.PresenterFileImage
                        src={imageUrl}
                        onClick={() => handleViewFile(imageUrl)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleViewFile(imageUrl);
                          }
                        }}
                      />

                      <DefaultStyled.Info>
                        <DefaultStyled.Text style={{ marginTop: '5px' }}>
                          Uploaded
                          {' '}
                          {formatUploadTime(new Date(file.createdAt))}
                        </DefaultStyled.Text>
                      </DefaultStyled.Info>

                      <Styled.PresenterActionButtons>
                        <CommonStyled.DeleteButton onClick={() => {
                          if (window.confirm('Are you sure you want to delete this image?')) {
                            deleteSubmitImage([file.entryId]);
                          }
                        }}
                        >
                          <TrashIcon />
                        </CommonStyled.DeleteButton>
                      </Styled.PresenterActionButtons>
                    </Styled.PresenterFileItem>
                  );
                })}
              </Styled.PresenterUserImagesContainer>
            </div>
          ))}
        </Styled.PresenterFilesList>
      )}
    </DefaultStyled.BaseContainer>
  );
}
