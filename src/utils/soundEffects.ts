
// Sound effect system for the game

// Sound effect types
export type SoundEffectType = 
  | 'jump' 
  | 'collect' 
  | 'death' 
  | 'rewind' 
  | 'victory' 
  | 'startRewind' 
  | 'endRewind' 
  | 'levelComplete'
  | 'restart';  // Added restart sound

// Music tracks
export type MusicTrackType = 
  | 'mainTheme'
  | 'level1'
  | 'level2'
  | 'level3';

// Cached audio objects
const soundEffects: Record<SoundEffectType, HTMLAudioElement | null> = {
  jump: null,
  collect: null,
  death: null,
  rewind: null,
  victory: null,
  startRewind: null,
  endRewind: null,
  levelComplete: null,
  restart: null,  // Added restart sound
};

const musicTracks: Record<MusicTrackType, HTMLAudioElement | null> = {
  mainTheme: null,
  level1: null,
  level2: null,
  level3: null,
};

// Sound paths
const soundPaths: Record<SoundEffectType, string> = {
  jump: 'https://assets.codepen.io/21542/howler-push.mp3',
  collect: 'https://assets.codepen.io/21542/howler-sfx-levelup.mp3',
  death: 'https://assets.codepen.io/21542/howler-sfx-laser4.mp3',
  rewind: 'https://assets.codepen.io/21542/howler-sfx-movement.mp3',
  victory: 'https://assets.codepen.io/21542/howler-sfx-coin.mp3',
  startRewind: 'https://assets.codepen.io/21542/howler-sfx-select.mp3',
  endRewind: 'https://assets.codepen.io/21542/howler-sfx-shot.mp3',
  levelComplete: 'https://assets.codepen.io/21542/howler-sfx-levelup.mp3',
  restart: 'https://assets.codepen.io/21542/howler-sfx-select.mp3', // Added restart sound
};

const musicPaths: Record<MusicTrackType, string> = {
  mainTheme: 'https://assets.codepen.io/21542/howler-demo-bg-music.mp3',
  level1: 'https://assets.codepen.io/21542/howler-demo-bg-music.mp3',
  level2: 'https://assets.codepen.io/21542/howler-demo-bg-music.mp3',
  level3: 'https://assets.codepen.io/21542/howler-demo-bg-music.mp3',
};

// Flag to track if sounds are enabled
let soundEnabled = true;
let musicVolume = 0.3;
let sfxVolume = 0.5;

// Preload all sounds to avoid delay
const preloadSounds = () => {
  for (const type in soundPaths) {
    const soundType = type as SoundEffectType;
    initSound(soundType);
  }
  
  for (const type in musicPaths) {
    const musicType = type as MusicTrackType;
    initMusic(musicType);
  }
};

// Initialize sounds (lazy loading)
const initSound = (type: SoundEffectType): HTMLAudioElement => {
  if (!soundEffects[type]) {
    soundEffects[type] = new Audio(soundPaths[type]);
    soundEffects[type]!.volume = sfxVolume;
  }
  return soundEffects[type]!;
};

const initMusic = (type: MusicTrackType): HTMLAudioElement => {
  if (!musicTracks[type]) {
    musicTracks[type] = new Audio(musicPaths[type]);
    musicTracks[type]!.volume = musicVolume;
    musicTracks[type]!.loop = true;
    
    // Set low latency attribute to reduce delay
    if ('mozPreservesPitch' in musicTracks[type]!) {
      // Firefox
      (musicTracks[type] as any).mozPreservesPitch = false;
    }
  }
  return musicTracks[type]!;
};

// Play a sound effect
export const playSoundEffect = (type: SoundEffectType): void => {
  if (!soundEnabled) return;
  
  const sound = initSound(type);
  
  // Reset sound if it's already playing
  sound.pause();
  sound.currentTime = 0;
  
  // Play with reduced latency
  const playPromise = sound.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.log(`Error playing sound: ${error}`);
    });
  }
};

// Play background music
export const playMusic = (type: MusicTrackType): void => {
  if (!soundEnabled) return;
  
  // Stop all currently playing music first
  stopAllMusic();
  
  const music = initMusic(type);
  
  // Try to reduce audio latency
  music.preload = 'auto';
  music.autoplay = true;
  
  const playPromise = music.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.log(`Error playing music: ${error}`);
      
      // Try again with user interaction later
      document.addEventListener('click', () => {
        music.play().catch(err => console.error("Music retry failed", err));
      }, { once: true });
    });
  }
};

// Stop all music
export const stopAllMusic = (): void => {
  Object.values(musicTracks).forEach(track => {
    if (track) {
      track.pause();
      track.currentTime = 0;
    }
  });
};

// Stop a specific sound effect
export const stopSoundEffect = (type: SoundEffectType): void => {
  if (soundEffects[type]) {
    soundEffects[type]!.pause();
    soundEffects[type]!.currentTime = 0;
  }
};

// Enable/disable all sounds
export const toggleSound = (enabled: boolean): void => {
  soundEnabled = enabled;
  
  if (!enabled) {
    // Stop all sounds when disabled
    stopAllMusic();
    Object.values(soundEffects).forEach(sound => {
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }
    });
  }
};

// Set volume levels
export const setMusicVolume = (volume: number): void => {
  musicVolume = Math.max(0, Math.min(1, volume));
  Object.values(musicTracks).forEach(track => {
    if (track) {
      track.volume = musicVolume;
    }
  });
};

export const setSfxVolume = (volume: number): void => {
  sfxVolume = Math.max(0, Math.min(1, volume));
  Object.values(soundEffects).forEach(sound => {
    if (sound) {
      sound.volume = sfxVolume;
    }
  });
};

// Preload all sounds at startup
if (typeof window !== 'undefined') {
  setTimeout(preloadSounds, 500);  // Delay preload to avoid initial load issues
}
