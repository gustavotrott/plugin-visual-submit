import * as React from 'react';
import {
  DataChannelEntryResponseType,
  PluginApi,
  CurrentUserData,
} from 'bigbluebutton-html-plugin-sdk';
import * as Styled from './styles';
import * as DefaultStyled from '../shared/styles';
import * as CommonStyled from '../../../styles/common';
import { AllUsersInfoGraphqlResponse, SubmitImage } from '../../visual-submit/types';
import { formatUploadTime } from '../../../utils/formatUploadTime';
import { TrashIcon } from '../../../utils/icons';
import { ALL_USERS_INFO } from '../user-view/queries';

interface PresenterSidekickAreaProps {
  submittedImages: DataChannelEntryResponseType<SubmitImage>[];
  pluginApi: PluginApi;
  currentUser: CurrentUserData;
}

export function PresenterSidekickArea({
  submittedImages,
  pluginApi,
  currentUser,
}: PresenterSidekickAreaProps): React.ReactElement {
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const {
    data: allUsersInfo,
  } = pluginApi.useCustomSubscription<AllUsersInfoGraphqlResponse>(ALL_USERS_INFO);

  // Count images per user
  const userImageCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    submittedImages.forEach((image) => {
      const { submittedBy } = image.payloadJson;
      counts.set(submittedBy.userId, (counts.get(submittedBy.userId) || 0) + 1);
    });
    return counts;
  }, [submittedImages]);

  // Filter images by selected user
  const filteredImages = React.useMemo(() => {
    if (!selectedUserId) return submittedImages;
    return submittedImages.filter((image) => (
      image.payloadJson.submittedBy.userId === selectedUserId
    ));
  }, [submittedImages, selectedUserId]);

  // Group images by all users in the meeting
  const groupedImages = React.useMemo(() => {
    if (!allUsersInfo?.user) return [];

    const groups = new Map<string, {
      user: { userId: string; userName: string; };
      images: DataChannelEntryResponseType<SubmitImage>[];
    }>();

    // Initialize groups for all users (exclude current user/presenter)
    allUsersInfo.user.forEach((user) => {
      const isNotCurrentUser = user.userId !== currentUser.userId;
      const isSelectedUser = !selectedUserId || user.userId === selectedUserId;

      if (isNotCurrentUser && isSelectedUser) {
        groups.set(user.userId, {
          user: { userId: user.userId, userName: user.name },
          images: [],
        });
      }
    });

    // Add images to respective user groups
    filteredImages.forEach((image) => {
      const { submittedBy } = image.payloadJson;
      const group = groups.get(submittedBy.userId);
      if (group) {
        group.images.push(image);
      }
    });

    return Array.from(groups.values());
  }, [filteredImages, allUsersInfo?.user, selectedUserId, currentUser.userId]);

  const handleViewFile = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  return (
    <DefaultStyled.BaseContainer>
      <Styled.PresenterTitle>
        Submitted Visual Content
        {' '}
        {filteredImages?.length > 0 && `(${filteredImages?.length})`}
      </Styled.PresenterTitle>

      {allUsersInfo?.user?.length > 0 && (
        <Styled.PresenterFilterContainer>
          <Styled.PresenterUserFilterSelect
            value={selectedUserId || ''}
            onChange={(e) => setSelectedUserId(e.target.value || null)}
          >
            <option value="">All Users</option>
            {allUsersInfo?.user
              .filter((user) => user.userId !== currentUser.userId)
              .map((user) => {
                const imageCount = userImageCounts.get(user.userId) || 0;
                return (
                  <option key={user.userId} value={user.userId}>
                    {user.name}
                    {' ('}
                    {imageCount}
                    )
                  </option>
                );
              })}
          </Styled.PresenterUserFilterSelect>
        </Styled.PresenterFilterContainer>
      )}

      {groupedImages.length === 0 ? (
        <Styled.PresenterEmptyState>
          No users found.
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

              {userGroup.images.length > 0 && (
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
              )}
            </div>
          ))}
        </Styled.PresenterFilesList>
      )}
    </DefaultStyled.BaseContainer>
  );
}
