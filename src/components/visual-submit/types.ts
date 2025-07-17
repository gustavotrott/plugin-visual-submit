export interface SubmitImage {
  imageUrl: string;
  submittedBy: {
    userId: string;
    userName: string;
  };
  renderedInLAD: boolean;
}

export interface UserMetadata {
  parameter: string;
  value: string;
}

export interface AllUsersData {
  userId: string;
  name: string;
}

export interface UserMetadataGraphqlResponse {
  user_metadata: UserMetadata[];
}

export interface SessionCurrent {
  sessionName: string;
}

export interface UserSessionCurrentGraphqlResponse {
  user_session_current: SessionCurrent[];
}

export interface UserSessionsCountGraphqlResponse {
  user_session_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

export interface AllUsersInfoGraphqlResponse {
  user: AllUsersData[];
}
