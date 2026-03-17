import { apiBaseUrl } from "./api-base";

export type SpotifySessionResponse =
  | {
      connected: false;
      message: string;
    }
  | {
      connected: true;
      profile: {
        id: string;
        displayName: string;
        email: string;
        product: string;
        isPremium: boolean;
      };
      taste: {
        topTracks: Array<{
          id: string;
          name: string;
          uri: string;
          artists: string[];
          imageUrl: string | null;
        }>;
        recentTracks: Array<{
          id: string;
          name: string;
          uri: string;
          artists: string[];
          imageUrl: string | null;
        }>;
        topArtists: Array<{
          id: string;
          name: string;
          genres: string[];
        }>;
        tailoredTrackUris: string[];
      };
      scope: string;
    };

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = (await response.json()) as T & { error?: string; message?: string };

  if (!response.ok) {
    throw new Error(data.error ?? data.message ?? "Spotify request failed.");
  }

  return data;
};

export const startSpotifyLogin = () => {
  window.location.href = `${apiBaseUrl}/spotify/login`;
};

export const getSpotifySession = () =>
  request<SpotifySessionResponse>("/spotify/session", {
    method: "GET",
  });

export const getSpotifySdkToken = () =>
  request<{ accessToken: string; expiresAt: number }>("/spotify/sdk-token", {
    method: "GET",
  });

export const playTailoredSpotifyMix = (deviceId: string) =>
  request<{ ok: true; queueLength: number }>("/spotify/player/play-tailored", {
    method: "POST",
    body: JSON.stringify({ deviceId }),
  });

export const logoutSpotify = () =>
  request<void>("/spotify/logout", {
    method: "POST",
  });
