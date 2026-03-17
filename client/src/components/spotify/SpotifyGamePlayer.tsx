import { useEffect, useRef, useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { ChevronDown, Disc3, Play, Pause, Radio } from "lucide-react";
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
  const [open, setOpen] = useState(false);
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
  const topArtists = session?.connected ? session.taste.topArtists.slice(0, 3) : [];
  const currentTrack = playerState?.track_window.current_track;
  const statusTone =
    status === "ready"
      ? "bg-emerald-400"
      : status === "error"
        ? "bg-red-400"
        : "bg-amber-400";
  const compactLabel = currentTrack
    ? `${currentTrack.name} • ${currentTrack.artists.map((artist) => artist.name).join(" / ")}`
    : session?.connected
      ? "Spotify linked"
      : "Spotify soundtrack offline";

  return (
    <div className="fixed left-1/2 top-20 z-[1600] w-[min(92vw,28rem)] -translate-x-1/2">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          className="group flex w-full items-center gap-3 rounded-full border border-white/35 bg-black/75 px-4 py-3 text-left text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition hover:bg-black/80"
        >
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusTone}`} />
          <span className="flex min-w-0 flex-1 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
              {playerState?.paused ? <Pause className="h-4 w-4" /> : <Disc3 className="h-4 w-4" />}
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-black uppercase tracking-[0.35em] text-white/60">
                Spotify Island
              </span>
              <span className="block truncate text-sm font-semibold">{compactLabel}</span>
            </span>
          </span>
          <ChevronDown className={`h-4 w-4 shrink-0 transition ${open ? "rotate-180" : ""}`} />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Positioner side="bottom" align="center" sideOffset={10}>
            <Popover.Popup className="z-[2200] w-[min(92vw,28rem)] rounded-[1.75rem] border border-white/35 bg-[linear-gradient(180deg,rgba(17,17,17,0.94),rgba(34,10,22,0.92))] p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/55">
                      Floating Soundtrack
                    </p>
                    <h2 className="mt-1.5 text-xl font-black uppercase italic tracking-tight">
                      Spotify Taste Sync
                    </h2>
                    <p className="mt-2 text-xs leading-5 text-white/70">{statusMessage}</p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-white/70">
                    <Radio className="h-3.5 w-3.5" />
                    {status}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {session?.connected ? (
                    <>
                      <button
                        onClick={() => void handlePlayTailoredMix()}
                        disabled={!deviceId || isBusy || status !== "ready"}
                        className="rounded-full bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {isBusy ? "Loading..." : "Play Tailored Mix"}
                      </button>
                      <button
                        onClick={() => void handleTogglePlayback()}
                        disabled={!playerState}
                        className="rounded-full border border-white/15 bg-white/8 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-white transition hover:border-white/35 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {playerState?.paused ? (
                          <span className="inline-flex items-center gap-2">
                            <Play className="h-3.5 w-3.5" />
                            Resume
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            <Pause className="h-3.5 w-3.5" />
                            Pause
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => void handleLogout()}
                        disabled={isBusy}
                        className="rounded-full border border-white/15 bg-black/20 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-white transition hover:border-white/35 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={startSpotifyLogin}
                      className="rounded-full bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-black transition hover:scale-[1.02]"
                    >
                      Connect Spotify
                    </button>
                  )}
                </div>

                {session?.connected && (
                  <div className="grid gap-3">
                    <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-3.5">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                          {session.profile.displayName}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                          {session.profile.product}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                          {session.taste.tailoredTrackUris.length} queued tracks
                        </span>
                      </div>
                    </div>

                    <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-3.5">
                      <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/55">
                        Now Playing
                      </p>
                      {currentTrack ? (
                        <div className="mt-3 flex items-center gap-3">
                          {currentTrack.album.images[0] ? (
                            <img
                              src={currentTrack.album.images[0].url}
                              alt={currentTrack.name}
                              className="h-12 w-12 rounded-2xl object-cover shadow-lg"
                            />
                          ) : null}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black uppercase tracking-tight">
                              {currentTrack.name}
                            </p>
                            <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                              {currentTrack.artists.map((artist) => artist.name).join(" / ")}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-3 text-xs leading-5 text-white/65">
                          Start the tailored mix and the active track will appear here.
                        </p>
                      )}
                    </div>

                    <div className="grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
                      <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-3.5">
                        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/55">
                          Top Artists
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {topArtists.map((artist) => (
                            <span
                              key={artist.id}
                              className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white"
                            >
                              {artist.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-3.5">
                        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/55">
                          Top Tracks
                        </p>
                        <div className="mt-3 grid gap-2">
                          {topTracks.slice(0, 2).map((track) => (
                            <div
                              key={track.id}
                              className="flex items-center gap-3 rounded-[1.1rem] border border-white/10 bg-black/20 p-2.5"
                            >
                              {track.imageUrl ? (
                                <img
                                  src={track.imageUrl}
                                  alt={track.name}
                                  className="h-10 w-10 rounded-xl object-cover"
                                />
                              ) : null}
                              <div className="min-w-0">
                                <p className="truncate text-xs font-black uppercase tracking-tight text-white">
                                  {track.name}
                                </p>
                                <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                                  {track.artists.join(" / ")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
