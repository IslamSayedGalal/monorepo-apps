export class GetPlaylistQuery {
  constructor(public readonly playlistId: string) { }
}

export class GetUserPlaylistsQuery {
  constructor(public readonly userId: string) { }
}

export class GetPublicPlaylistsQuery {
  constructor() { /* empty */ }
}

