export interface SubmitImage {
  imageUrl: string;
  submittedBy: {
    userId: string;
    userName: string;
  }
}

export interface UserMetadata {
  parameter: string;
  value: string;
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
