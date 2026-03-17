import { Elysia, t } from "elysia";
import { spotifyConfig } from "../spotify/constants";
import {
  clearSpotifySessionCookie,
  createSpotifySessionCookie,
  getSpotifySessionIdFromCookieHeader,
} from "../spotify/session-store";
import { spotifyService } from "../spotify/spotify.service";

const unauthorized = (message: string) => ({
  connected: false as const,
  message,
});

const getSessionId = (request: Request) =>
  getSpotifySessionIdFromCookieHeader(request.headers.get("cookie"));

export const spotifyRoutes = new Elysia({ prefix: "/spotify" })
  .get("/login", ({ set }) => {
    if (!spotifyService.isConfigured()) {
      set.status = 503;
      return {
        error: "Spotify is not configured on the server. Add SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI, and CLIENT_APP_URL.",
      };
    }

    return Response.redirect(spotifyService.getLoginUrl(), 302);
  })
  .get(
    "/callback",
    async ({ query, set }) => {
      const code = query.code;
      const state = query.state;
      const error = query.error;

      if (error) {
        return Response.redirect(
          `${spotifyConfig.clientAppUrl}/?spotify=error&reason=${encodeURIComponent(error)}`,
          302,
        );
      }

      if (!code || !state) {
        set.status = 400;
        return { error: "Missing Spotify callback code or state." };
      }

      try {
        const session = await spotifyService.exchangeCodeForSession(code, state);
        const headers = new Headers({
          Location: `${spotifyConfig.clientAppUrl}/?spotify=connected`,
        });
        headers.append("Set-Cookie", createSpotifySessionCookie(session.id));

        return new Response(null, {
          status: 302,
          headers,
        });
      } catch (requestError) {
        const reason =
          requestError instanceof Error ? requestError.message : "Spotify authentication failed.";

        return Response.redirect(
          `${spotifyConfig.clientAppUrl}/?spotify=error&reason=${encodeURIComponent(reason)}`,
          302,
        );
      }
    },
    {
      query: t.Object({
        code: t.Optional(t.String()),
        state: t.Optional(t.String()),
        error: t.Optional(t.String()),
      }),
    },
  )
  .get("/session", async ({ request, set }) => {
    if (!spotifyService.isConfigured()) {
      set.status = 503;
      return unauthorized("Spotify is not configured on the server.");
    }

    const sessionId = getSessionId(request);

    if (!sessionId) {
      return unauthorized("Connect Spotify to build a tailored soundtrack.");
    }

    try {
      const summary = await spotifyService.getSessionSummary(sessionId);

      if (!summary) {
        set.status = 401;
        return unauthorized("Your Spotify session expired. Connect again.");
      }

      return summary;
    } catch (requestError) {
      set.status = 500;
      return unauthorized(
        requestError instanceof Error ? requestError.message : "Could not load Spotify session.",
      );
    }
  })
  .get("/sdk-token", async ({ request, set }) => {
    const sessionId = getSessionId(request);

    if (!sessionId) {
      set.status = 401;
      return { error: "Spotify session is missing." };
    }

    const token = await spotifyService.getSdkToken(sessionId);

    if (!token) {
      set.status = 401;
      return { error: "Spotify session expired." };
    }

    return token;
  })
  .post(
    "/player/play-tailored",
    async ({ body, request, set }) => {
      const sessionId = getSessionId(request);

      if (!sessionId) {
        set.status = 401;
        return { error: "Spotify session is missing." };
      }

      try {
        return await spotifyService.startTailoredPlayback(sessionId, body.deviceId);
      } catch (requestError) {
        set.status = 400;
        return {
          error:
            requestError instanceof Error
              ? requestError.message
              : "Spotify could not start playback.",
        };
      }
    },
    {
      body: t.Object({
        deviceId: t.String(),
      }),
    },
  )
  .post("/logout", ({ request }) => {
    const sessionId = getSessionId(request);
    const headers = new Headers();
    headers.append("Set-Cookie", clearSpotifySessionCookie());

    if (sessionId) {
      spotifyService.logout(sessionId);
    }

    return new Response(null, {
      status: 204,
      headers,
    });
  });
