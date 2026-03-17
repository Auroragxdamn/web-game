export const spotifyScopes = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-top-read",
  "user-read-recently-played",
  "user-modify-playback-state",
] as const;

export const spotifyConfig = {
  clientId: Bun.env.SPOTIFY_CLIENT_ID ?? "",
  clientSecret: Bun.env.SPOTIFY_CLIENT_SECRET ?? "",
  redirectUri: Bun.env.SPOTIFY_REDIRECT_URI ?? "http://localhost:3000/spotify/callback",
  clientAppUrl: Bun.env.CLIENT_APP_URL ?? "http://localhost:5173",
  sessionCookieName: "spotify_session",
  stateLifetimeMs: 10 * 60 * 1000,
  sessionLifetimeSeconds: 60 * 60 * 24 * 30,
};

export const hasSpotifyConfig = () =>
  Boolean(
    spotifyConfig.clientId &&
      spotifyConfig.clientSecret &&
      spotifyConfig.redirectUri &&
      spotifyConfig.clientAppUrl,
  );
