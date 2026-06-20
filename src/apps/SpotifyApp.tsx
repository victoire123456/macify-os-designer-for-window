import React, { useState, useEffect } from 'react';
import { useMacify } from '../store';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, List, Heart, Sliders, PlayCircle } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverEmoji: string;
  gradient: string;
}

const SPOTIFY_PLAYLIST: Track[] = [
  { id: '1', title: 'Summer Lo-Fi Beats', artist: 'Zen Wave', album: 'Sunset Chillout', duration: '2:45', coverEmoji: '🌅', gradient: 'from-orange-400 to-rose-400' },
  { id: '2', title: 'Silicon Valley Hackathon', artist: 'The Compilers', album: 'Dev Session Loop', duration: '3:12', coverEmoji: '💻', gradient: 'from-sky-500 to-violet-500' },
  { id: '3', title: 'Cupertino Ambient Dream', artist: 'Foliage Sound', album: 'California Pine', duration: '4:01', coverEmoji: '🌲', gradient: 'from-emerald-400 to-teal-500' },
  { id: '4', title: 'Neon Highway Horizon', artist: 'Synth Retro', album: 'Outrun 84', duration: '3:30', coverEmoji: '🚗', gradient: 'from-fuchsia-500 to-cyan-500' }
];

export default function SpotifyApp() {
  const { isDarkMode } = useMacify();
  const [activeTrack, setActiveTrack] = useState<Track>(SPOTIFY_PLAYLIST[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30); // scale 0 to 100
  const [volume, setVolume] = useState(70);

  // Sound bars animation multiplier values
  const [soundHeights, setSoundHeights] = useState<number[]>([12, 24, 8, 32, 16, 20]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) return 0;
          return p + 1;
        });

        // randomise visualizer bars heights
        setSoundHeights(Array.from({ length: 6 }, () => Math.floor(Math.random() * 32) + 4));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleTrackSelect = (track: Track) => {
    setActiveTrack(track);
    setProgress(0);
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="flex flex-1 h-full select-none text-white font-sans bg-neutral-950 flex-col justify-between" id="spotify-app-root">
      {/* Upper Content layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Navigation List */}
        <div className="w-14 bg-neutral-900 border-r border-neutral-800 p-2 h-full overflow-y-auto shrink-0 flex flex-col justify-between">
          <div>
            <div className="space-y-1 mt-2">
              <button className="w-full flex items-center justify-center py-2 text-xs font-semibold rounded-lg bg-sky-500/10 text-sky-400 cursor-pointer" title="Playlist 1">
                <Music size={14} />
              </button>
              <button onClick={() => alert('Search channel initiated')} className="w-full flex items-center justify-center py-2 text-xs text-neutral-400 font-medium hover:text-white rounded-lg cursor-pointer" title="Favorites">
                <Music size={14} className="text-neutral-500" />
              </button>
            </div>
          </div>

          <div className="p-1 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/25 text-center select-none flex flex-col items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Sound driver synchronized." />
          </div>
        </div>

        {/* Songs table list view */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-neutral-800">
            <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${activeTrack.gradient} flex items-center justify-center text-4xl shadow-xl`}>
              {activeTrack.coverEmoji}
            </div>
            <div>
              <span className="text-[9px] font-bold text-sky-500 font-mono tracking-widest uppercase">Currently Streaming</span>
              <h2 className="text-2xl font-serif italic mt-0.5 text-white">{activeTrack.title}</h2>
              <p className="text-xs text-neutral-400 font-light font-sans mt-1">{activeTrack.artist} — {activeTrack.album}</p>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono tracking-widest">Global Playlist Items</span>
            <div className="space-y-1 mt-2">
              {SPOTIFY_PLAYLIST.map((track, i) => {
                const isActive = track.id === activeTrack.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => handleTrackSelect(track)}
                    className={`flex items-center justify-between p-2 px-3 rounded-lg cursor-pointer transition ${
                      isActive
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold'
                        : 'hover:bg-neutral-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <span className="text-xs text-neutral-500 font-mono">{i + 1}</span>
                      <span className="text-lg bg-neutral-900 p-1 rounded shadow">{track.coverEmoji}</span>
                      <div className="truncate">
                        <div className="text-xs truncate">{track.title}</div>
                        <div className="text-[10px] text-neutral-450 truncate">{track.artist}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500">{track.duration}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Streaming media controls bar (Bottom) */}
      <div className="h-18 px-5 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3 w-40 truncate">
          <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${activeTrack.gradient} flex items-center justify-center text-2xl shrink-0`}>
            {activeTrack.coverEmoji}
          </div>
          <div className="truncate text-left leading-tight">
            <div className="text-xs font-bold truncate">{activeTrack.title}</div>
            <div className="text-[10px] text-neutral-400 truncate">{activeTrack.artist}</div>
          </div>
        </div>

        {/* Play control strip */}
        <div className="flex flex-col items-center flex-1 max-w-sm px-4">
          <div className="flex items-center space-x-4 mb-1.5">
            <SkipBack size={14} className="text-neutral-400 hover:text-white cursor-pointer" />
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 cursor-pointer transition shadow"
            >
              {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} className="ml-0.5" fill="currentColor" />}
            </button>
            <SkipForward size={14} className="text-neutral-400 hover:text-white cursor-pointer" />
          </div>

          {/* Progress Timeline */}
          <div className="flex items-center space-x-1 w-full text-[9px] font-mono text-neutral-500 leading-none">
            <span>0:{progress < 10 ? `0${progress}` : progress}</span>
            <div className="flex-1 mx-1.5 bg-neutral-800 h-1.5 rounded-full cursor-pointer relative overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${progress}%` }} />
            </div>
            <span>3:15</span>
          </div>
        </div>

        {/* Volume & Equalizer graphic */}
        <div className="flex items-center space-x-4 w-40 justify-end">
          {/* Audio Visualizer anim bars */}
          <div className="flex items-end space-x-0.5 h-6">
            {soundHeights.map((h, i) => (
              <div
                key={i}
                style={{ height: isPlaying ? `${h}px` : '4px' }}
                className="bg-emerald-500 w-[2px] rounded-full transition-all duration-300"
              />
            ))}
          </div>

          <Volume2 size={13} className="text-neutral-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-16 accent-emerald-500 cursor-pointer h-1 rounded"
          />
        </div>
      </div>
    </div>
  );
}
