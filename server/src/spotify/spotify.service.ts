import SpotifyWebApi from "spotify-web-api-node";
import { hasSpotifyConfig, spotifyConfig, spotifyScopes } from "./constants";
import {
  consumeSpotifyState,
  createSpotifySession,
  createSpotifyState,
  deleteSpotifySession,
  getSpotifySession,
  updateSpotifySession,
  type SpotifySession,
} from "./session-store";

type SpotifyImage = {
  url?: string;
};

type SpotifyArtist = {
  id?: string;
  name?: string;
  genres?: string[];
};

type SpotifyTrack = {
  id?: string;
  name?: string;
  uri?: string;
  artists?: SpotifyArtist[];
  album?: {
    images?: SpotifyImage[];
  };
};

type SpotifyProfile = {
  id?: string;
  display_name?: string;
  email?: string;
  product?: string;
};

const createSpotifyApi = () =>
  new SpotifyWebApi({
    clientId: spotifyConfig.clientId,
    clientSecret: spotifyConfig.clientSecret,
    redirectUri: spotifyConfig.redirectUri,
  });

const withSessionApi = (session: SpotifySession) => {
  const spotifyApi = createSpotifyApi();
  spotifyApi.setAccessToken(session.accessToken);
  spotifyApi.setRefreshToken(session.refreshToken);
  return spotifyApi;
};

const mapTrack = (track: SpotifyTrack) => ({
  id: track.id ?? "",
  name: track.name ?? "Unknown track",
  uri: track.uri ?? "",
  artists: (track.artists ?? []).map((artist) => artist.name ?? "Unknown artist"),
  imageUrl: track.album?.images?.[0]?.url ?? null,
});

const dedupeUris = (uris: Array<string | undefined>) => {
  const unique = new Set<string>();

  for (const uri of uris) {
    if (uri) {
      unique.add(uri);
    }
  }

  return [...unique];
};

export const spotifyService = {
  isConfigured() {
    return hasSpotifyConfig();
  },

  getLoginUrl() {
    const state = createSpotifyState();
    return createSpotifyApi().createAuthorizeURL([...spotifyScopes], state, true);
  },

  async exchangeCodeForSession(code: string, state: string) {
    if (!consumeSpotifyState(state)) {
      throw new Error("Spotify login state expired or is invalid.");
    }

    const spotifyApi = createSpotifyApi();
    const { body } = await spotifyApi.authorizationCodeGrant(code);

    return createSpotifySession({
      accessToken: body.access_token,
      refreshToken: body.refresh_token,
      expiresAt: Date.now() + body.expires_in * 1000,
      scope: body.scope,
    });
  },

  async ensureFreshSession(sessionId: string) {
    const session = getSpotifySession(sessionId);

    if (!session) {
      return undefined;
    }

    if (session.expiresAt > Date.now() + 60_000) {
      return session;
    }

    const spotifyApi = withSessionApi(session);
    const { body } = await spotifyApi.refreshAccessToken();

    return updateSpotifySession(sessionId, {
      accessToken: body.access_token,
      expiresAt: Date.now() + body.expires_in * 1000,
      scope: body.scope ?? session.scope,
    });
  },

  async getSessionSummary(sessionId: string) {
    const session = await this.ensureFreshSession(sessionId);

    if (!session) {
      return undefined;
    }

    const spotifyApi = withSessionApi(session);
    const [{ body: profile }, { body: topTracks }, { body: topArtists }, { body: recentTracks }] =
      await Promise.all([
        spotifyApi.getMe(),
        spotifyApi.getMyTopTracks({ limit: 10, time_range: "short_term" }),
        spotifyApi.getMyTopArtists({ limit: 5, time_range: "short_term" }),
        spotifyApi.getMyRecentlyPlayedTracks({ limit: 10 }),
      ]);

    const topTrackItems = ((topTracks.items ?? []) as SpotifyTrack[]).map(mapTrack);
    const recentTrackItems = ((recentTracks.items ?? []) as Array<{ track?: SpotifyTrack }>)
      .map((item) => item.track)
      .filter(Boolean)
      .map((track) => mapTrack(track as SpotifyTrack));

    const tailoredTrackUris = dedupeUris([
      ...recentTrackItems.map((track) => track.uri),
      ...topTrackItems.map((track) => track.uri),
    ]).slice(0, 20);

    return {
      connected: true as const,
      profile: {
        id: (profile as SpotifyProfile).id ?? "",
        displayName: (profile as SpotifyProfile).display_name ?? "Spotify Player",
        email: (profile as SpotifyProfile).email ?? "",
        product: (profile as SpotifyProfile).product ?? "",
        isPremium: (profile as SpotifyProfile).product === "premium",
      },
      taste: {
        topTracks: topTrackItems,
        recentTracks: recentTrackItems,
        topArtists: ((topArtists.items ?? []) as SpotifyArtist[]).map((artist) => ({
          id: artist.id ?? "",
          name: artist.name ?? "Unknown artist",
          genres: artist.genres ?? [],
        })),
        tailoredTrackUris,
      },
      scope: session.scope,
    };
  },

  async getSdkToken(sessionId: string) {
    const session = await this.ensureFreshSession(sessionId);

    if (!session) {
      return undefined;
    }

    return {
      accessToken: session.accessToken,
      expiresAt: session.expiresAt,
    };
  },

  async startTailoredPlayback(sessionId: string, deviceId: string) {
    const session = await this.ensureFreshSession(sessionId);

    if (!session) {
      return undefined;
    }

    const summary = await this.getSessionSummary(sessionId);

    if (!summary) {
      return undefined;
    }

    if (summary.taste.tailoredTrackUris.length === 0) {
      throw new Error("Spotify could not find enough listening history to build a tailored queue.");
    }

    const spotifyApi = withSessionApi(session);
    await spotifyApi.transferMyPlayback([deviceId], { play: true });
    await spotifyApi.play({
      device_id: deviceId,
      uris: summary.taste.tailoredTrackUris,
    });

    return {
      ok: true as const,
      queueLength: summary.taste.tailoredTrackUris.length,
    };
  },

  logout(sessionId: string) {
    deleteSpotifySession(sessionId);
  },
};
