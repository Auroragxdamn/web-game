import { spotifyConfig } from "./constants";

export type SpotifySession = {
  id: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scope: string;
};

const spotifySessions = new Map<string, SpotifySession>();
const pendingStates = new Map<string, number>();

const encodeCookieValue = (value: string) => encodeURIComponent(value);

export const createSpotifyState = () => {
  const state = crypto.randomUUID();
  pendingStates.set(state, Date.now());
  return state;
};

export const consumeSpotifyState = (state: string) => {
  const createdAt = pendingStates.get(state);

  if (!createdAt) {
    return false;
  }

  pendingStates.delete(state);
  return Date.now() - createdAt <= spotifyConfig.stateLifetimeMs;
};

export const createSpotifySession = (session: Omit<SpotifySession, "id">) => {
  const id = crypto.randomUUID();
  const fullSession = { id, ...session };
  spotifySessions.set(id, fullSession);
  return fullSession;
};

export const getSpotifySession = (id: string | undefined) => {
  if (!id) {
    return undefined;
  }

  return spotifySessions.get(id);
};

export const updateSpotifySession = (id: string, update: Partial<Omit<SpotifySession, "id">>) => {
  const current = spotifySessions.get(id);

  if (!current) {
    return undefined;
  }

  const next = { ...current, ...update };
  spotifySessions.set(id, next);
  return next;
};

export const deleteSpotifySession = (id: string | undefined) => {
  if (!id) {
    return;
  }

  spotifySessions.delete(id);
};

export const getSpotifySessionIdFromCookieHeader = (cookieHeader: string | null) => {
  if (!cookieHeader) {
    return undefined;
  }

  const cookies = cookieHeader.split(";").map((part) => part.trim());
  const cookiePrefix = `${spotifyConfig.sessionCookieName}=`;
  const cookieValue = cookies.find((cookie) => cookie.startsWith(cookiePrefix));

  if (!cookieValue) {
    return undefined;
  }

  return decodeURIComponent(cookieValue.slice(cookiePrefix.length));
};

export const createSpotifySessionCookie = (sessionId: string) =>
  `${spotifyConfig.sessionCookieName}=${encodeCookieValue(sessionId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${spotifyConfig.sessionLifetimeSeconds}`;

export const clearSpotifySessionCookie = () =>
  `${spotifyConfig.sessionCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
