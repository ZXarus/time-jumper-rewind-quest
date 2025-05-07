
import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { toggleSound, setMusicVolume, setSfxVolume } from '@/utils/soundEffects';
import { MUSIC_VOLUME, SFX_VOLUME, SOUND_ENABLED } from '@/constants/gameConstants';

const SoundControl = () => {
  const [soundOn, setSoundOn] = useState(SOUND_ENABLED);
  const [musicVol, setMusicVol] = useState(MUSIC_VOLUME);
  const [sfxVol, setSfxVol] = useState(SFX_VOLUME);

  useEffect(() => {
    toggleSound(soundOn);
  }, [soundOn]);

  useEffect(() => {
    setMusicVolume(musicVol);
  }, [musicVol]);

  useEffect(() => {
    setSfxVolume(sfxVol);
  }, [sfxVol]);

  const toggleSoundState = () => {
    setSoundOn(prev => !prev);
  };

  return (
    <div className="absolute top-3 right-3 flex items-center gap-3 bg-black/30 backdrop-blur-sm p-2 rounded-lg z-50">
      <button
        onClick={toggleSoundState}
        className="text-white hover:text-game-energy transition-colors"
        title={soundOn ? "Mute" : "Unmute"}
      >
        {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
      
      <div className="flex items-center gap-2">
        <Music size={18} className="text-white" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={musicVol}
          onChange={(e) => setMusicVol(parseFloat(e.target.value))}
          className="w-12 h-1 appearance-none bg-white/30 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Volume2 size={18} className="text-white" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={sfxVol}
          onChange={(e) => setSfxVol(parseFloat(e.target.value))}
          className="w-12 h-1 appearance-none bg-white/30 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        />
      </div>
    </div>
  );
};

export default SoundControl;
