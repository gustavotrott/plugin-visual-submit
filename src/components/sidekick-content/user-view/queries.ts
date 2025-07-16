export const USERS_METADATA = `
subscription userMetadata {
  user_metadata {
    parameter
    value
  }
}
`;

export const ALL_USERS_INFO = `
subscription allUsersInfo {
  user {
    userId
    name
  }
}
`;
