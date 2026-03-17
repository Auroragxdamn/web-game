type SpotifyPlayerInit = {
  name: string;
  getOAuthToken: (callback: (token: string) => void) => void;
  volume?: number;
};

type SpotifyPlayerState = {
  paused: boolean;
  position: number;
  duration: number;
  track_window: {
    current_track: {
      name: string;
      artists: Array<{ name: string }>;
      album: {
        images: Array<{ url: string }>;
      };
    };
  };
};

type SpotifyPlayerReady = {
  device_id: string;
};

interface SpotifyPlayer {
  addListener: (event: string, callback: (payload: any) => boolean | void) => boolean | void;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  getCurrentState: () => Promise<SpotifyPlayerState | null>;
  togglePlay: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
}

interface Window {
  Spotify?: {
    Player: new (init: SpotifyPlayerInit) => SpotifyPlayer;
  };
  onSpotifyWebPlaybackSDKReady?: () => void;
}
