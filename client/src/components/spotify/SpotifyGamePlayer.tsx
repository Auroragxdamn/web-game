import { useEffect, useRef, useState } from "react";
import {
  getSpotifySdkToken,
  getSpotifySession,
  logoutSpotify,
  playTailoredSpotifyMix,
  startSpotifyLogin,
  type SpotifySessionResponse,
} from "@/lib/spotify";

type PlayerStatus = "idle" | "loading" | "ready" | "error";

const sdkScriptId = "spotify-player-sdk";

const loadSpotifySdk = async () => {
  if (window.Spotify) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(sdkScriptId) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.Spotify) {
        resolve();
        return;
      }

      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Spotify SDK failed to load.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = sdkScriptId;
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.onerror = () => reject(new Error("Spotify SDK failed to load."));

    window.onSpotifyWebPlaybackSDKReady = () => resolve();
    document.body.appendChild(script);
  });
};

export function SpotifyGamePlayer() {
  const [session, setSession] = useState<SpotifySessionResponse | null>(null);
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("Connect Spotify to turn the game into a tailored soundtrack.");
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<SpotifyPlayerState | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const playerRef = useRef<SpotifyPlayer | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (!params.get("spotify")) {
      return;
    }

    params.delete("spotify");
    params.delete("reason");
    const nextQuery = params.toString();
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`;
    window.history.replaceState({}, "", nextUrl);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const setupPlayer = async () => {
      try {
        const nextSession = await getSpotifySession();

        if (!isMounted) {
          return;
        }

        setSession(nextSession);

        if (!nextSession.connected) {
          setStatus("idle");
          setStatusMessage(nextSession.message);
          return;
        }

        if (!nextSession.profile.isPremium) {
          setStatus("error");
          setStatusMessage("Spotify Web Playback SDK requires a Premium account.");
          return;
        }

        setStatus("loading");
        setStatusMessage("Preparing your browser as a Spotify playback device...");

        await loadSpotifySdk();

        if (!window.Spotify) {
          throw new Error("Spotify SDK did not initialize.");
        }

        const player = new window.Spotify.Player({
          name: "Project Stellar Player",
          volume: 0.5,
          getOAuthToken: async (callback) => {
            try {
              const token = await getSpotifySdkToken();
              callback(token.accessToken);
            } catch (tokenError) {
              if (!isMounted) {
                return;
              }

              setStatus("error");
              setStatusMessage(
                tokenError instanceof Error ? tokenError.message : "Spotify token refresh failed.",
              );
            }
          },
        });

        player.addListener("ready", ({ device_id }: SpotifyPlayerReady) => {
          if (!isMounted) {
            return;
          }

          setDeviceId(device_id);
          setStatus("ready");
          setStatusMessage("Spotify is linked. Start the tailored mix when you are ready.");
        });

        player.addListener("not_ready", () => {
          if (!isMounted) {
            return;
          }

          setStatus("error");
          setStatusMessage("Spotify playback device went offline.");
        });

        player.addListener("initialization_error", ({ message }: { message: string }) => {
          if (!isMounted) {
            return;
          }

          setStatus("error");
          setStatusMessage(message);
        });

        player.addListener("authentication_error", ({ message }: { message: string }) => {
          if (!isMounted) {
            return;
          }

          setStatus("error");
          setStatusMessage(message);
        });

        player.addListener("account_error", ({ message }: { message: string }) => {
          if (!isMounted) {
            return;
          }

          setStatus("error");
          setStatusMessage(message);
        });

        player.addListener("player_state_changed", (nextState: SpotifyPlayerState | null) => {
          if (!isMounted) {
            return;
          }

          setPlayerState(nextState);
        });

        const connected = await player.connect();

        if (!connected) {
          throw new Error("Spotify player could not connect.");
        }

        if (!isMounted) {
          player.disconnect();
          return;
        }

        playerRef.current = player;
      } catch (sessionError) {
        if (!isMounted) {
          return;
        }

        setStatus("error");
        setStatusMessage(
          sessionError instanceof Error ? sessionError.message : "Spotify session could not load.",
        );
      }
    };

    void setupPlayer();

    return () => {
      isMounted = false;
      playerRef.current?.disconnect();
      playerRef.current = null;
    };
  }, []);

  const handlePlayTailoredMix = async () => {
    if (!deviceId) {
      return;
    }

    setIsBusy(true);
    setStatusMessage("Building a queue from the listener's recent taste...");

    try {
      await playTailoredSpotifyMix(deviceId);
      const nextState = await playerRef.current?.getCurrentState();
      setPlayerState(nextState ?? null);
      setStatusMessage("Tailored soundtrack is live.");
    } catch (playError) {
      setStatus("error");
      setStatusMessage(playError instanceof Error ? playError.message : "Playback failed.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleTogglePlayback = async () => {
    if (!playerRef.current) {
      return;
    }

    await playerRef.current.togglePlay();
    const nextState = await playerRef.current.getCurrentState();
    setPlayerState(nextState);
  };

  const handleLogout = async () => {
    setIsBusy(true);

    try {
      await logoutSpotify();
      playerRef.current?.disconnect();
      playerRef.current = null;
      setDeviceId(null);
      setPlayerState(null);
      setSession({
        connected: false,
        message: "Connect Spotify to build a tailored soundtrack.",
      });
      setStatus("idle");
      setStatusMessage("Spotify disconnected.");
    } finally {
      setIsBusy(false);
    }
  };

  const topTracks = session?.connected ? session.taste.topTracks.slice(0, 3) : [];
  const topArtists = session?.connected ? session.taste.topArtists.slice(0, 4) : [];
  const currentTrack = playerState?.track_window.current_track;

  return (
    <section className="w-full max-w-5xl rounded-[2rem] border border-primary/10 bg-white/70 p-6 shadow-2xl shadow-primary/5 backdrop-blur-xl md:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.35em] text-primary/70">
              Game Soundtrack
            </p>
            <h2 className="text-3xl font-black uppercase italic tracking-tight text-foreground md:text-4xl">
              Spotify Taste Sync
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{statusMessage}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {session?.connected ? (
              <>
                <button
                  onClick={() => void handlePlayTailoredMix()}
                  disabled={!deviceId || isBusy || status !== "ready"}
                  className="rounded-full bg-primary px-6 py-3 text-[11px] font-black uppercase tracking-[0.25em] text-primary-foreground transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isBusy ? "Loading..." : "Play Tailored Mix"}
                </button>
                <button
                  onClick={() => void handleTogglePlayback()}
                  disabled={!playerState}
                  className="rounded-full border border-primary/20 bg-white px-6 py-3 text-[11px] font-black uppercase tracking-[0.25em] text-foreground transition hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {playerState?.paused ? "Resume" : "Pause"}
                </button>
                <button
                  onClick={() => void handleLogout()}
                  disabled={isBusy}
                  className="rounded-full border border-foreground/10 bg-foreground px-6 py-3 text-[11px] font-black uppercase tracking-[0.25em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={startSpotifyLogin}
                className="rounded-full bg-primary px-6 py-3 text-[11px] font-black uppercase tracking-[0.25em] text-primary-foreground transition hover:scale-[1.02]"
              >
                Connect Spotify
              </button>
            )}
          </div>
        </div>

        {session?.connected && (
          <div className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-primary/12 via-white to-primary/5 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary/70">
                Listener Snapshot
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground shadow-sm">
                  {session.profile.displayName}
                </span>
                <span className="rounded-full bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground shadow-sm">
                  {session.profile.product}
                </span>
                <span className="rounded-full bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground shadow-sm">
                  {session.taste.tailoredTrackUris.length} queued tracks
                </span>
              </div>

              <div className="mt-5">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground">
                  Top Artists
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {topArtists.map((artist) => (
                    <span
                      key={artist.id}
                      className="rounded-full border border-primary/10 bg-white/80 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-foreground"
                    >
                      {artist.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-primary/10 bg-white/80 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary/70">
                Now Playing
              </p>
              {currentTrack ? (
                <div className="mt-4 flex items-center gap-4">
                  {currentTrack.album.images[0] ? (
                    <img
                      src={currentTrack.album.images[0].url}
                      alt={currentTrack.name}
                      className="h-16 w-16 rounded-2xl object-cover shadow-lg"
                    />
                  ) : null}
                  <div>
                    <p className="text-lg font-black uppercase tracking-tight text-foreground">
                      {currentTrack.name}
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                      {currentTrack.artists.map((artist) => artist.name).join(" / ")}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Start the tailored mix and the active track will appear here.
                </p>
              )}
            </div>
          </div>
        )}

        {session?.connected && (
          <div>
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground">
              Top Short-Term Tracks
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {topTracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center gap-4 rounded-[1.25rem] border border-primary/10 bg-white/85 p-4"
                >
                  {track.imageUrl ? (
                    <img
                      src={track.imageUrl}
                      alt={track.name}
                      className="h-14 w-14 rounded-2xl object-cover"
                    />
                  ) : null}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black uppercase tracking-tight text-foreground">
                      {track.name}
                    </p>
                    <p className="mt-1 truncate text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      {track.artists.join(" / ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
