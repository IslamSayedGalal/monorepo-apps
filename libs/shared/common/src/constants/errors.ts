export const ErrorMessages = {
  INTERNAL_SERVER_ERROR: 'An internal server error occurred',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  INVALID_UUID: 'Invalid UUID format',

  PLAYLIST_NOT_FOUND: 'Playlist not found',
  PLAYLIST_ALREADY_EXISTS: 'Playlist with this name already exists',

  RECITATION_NOT_FOUND: 'Recitation not found',

  TAG_NOT_FOUND: 'Tag not found',
  TAG_ALREADY_EXISTS: 'Tag with this name already exists',
} as const;
