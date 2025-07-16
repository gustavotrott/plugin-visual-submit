import * as React from 'react';
import { DataChannelEntryResponseType } from 'bigbluebutton-html-plugin-sdk';
import * as Styled from './styles';
import * as DefaultStyled from '../shared/styles';
import * as CommonStyled from '../../../styles/common';
import { SubmitImage } from '../../visual-submit/types';
import { formatUploadTime } from '../../../utils/formatUploadTime';
import { TrashIcon } from '../../../utils/icons';

interface PresenterSidekickAreaProps {
  submittedImages: DataChannelEntryResponseType<SubmitImage>[];
}

export function PresenterSidekickArea({
  submittedImages,
}: PresenterSidekickAreaProps): React.ReactElement {
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);

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
                        <CommonStyled.DeleteButton>
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
