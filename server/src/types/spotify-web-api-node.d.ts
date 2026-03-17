declare module "spotify-web-api-node" {
  export type SpotifyApiResponse<T = any> = Promise<{ body: T }>;

  export default class SpotifyWebApi {
    constructor(options?: {
      clientId?: string;
      clientSecret?: string;
      redirectUri?: string;
      accessToken?: string;
      refreshToken?: string;
    });

    setAccessToken(accessToken: string): void;
    setRefreshToken(refreshToken: string): void;

    createAuthorizeURL(scopes: string[], state: string, showDialog?: boolean): string;
    authorizationCodeGrant(code: string): SpotifyApiResponse<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
      scope: string;
    }>;
    refreshAccessToken(): SpotifyApiResponse<{
      access_token: string;
      expires_in: number;
      scope?: string;
    }>;

    getMe(): SpotifyApiResponse<any>;
    getMyTopTracks(options?: Record<string, unknown>): SpotifyApiResponse<any>;
    getMyTopArtists(options?: Record<string, unknown>): SpotifyApiResponse<any>;
    getMyRecentlyPlayedTracks(options?: Record<string, unknown>): SpotifyApiResponse<any>;
    transferMyPlayback(deviceIds: string[], options?: Record<string, unknown>): SpotifyApiResponse<any>;
    play(options?: Record<string, unknown>): SpotifyApiResponse<any>;
  }
}
