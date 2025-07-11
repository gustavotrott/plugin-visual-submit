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

export interface UserMetadataGraphqlResponse {
  user_metadata: UserMetadata[];
}
