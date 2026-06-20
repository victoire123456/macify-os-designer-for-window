import React, { useState, useEffect } from 'react';
import { Globe, Plus, Check, Clock, Sun, Moon, Compass } from 'lucide-react';
import { useMacify } from '../store';

export interface WorldCityInfo {
  name: string;
  timezone: string;
  country: string;
  abbreviation: string;
}

export const WORLD_CITIES_REGISTRY: Record<string, WorldCityInfo> = {
  'Kigali': { name: 'Kigali', timezone: 'Africa/Kigali', country: 'Rwanda', abbreviation: 'CAT' },
  'London': { name: 'London', timezone: 'Europe/London', country: 'United Kingdom', abbreviation: 'GMT' },
  'Paris': { name: 'Paris', timezone: 'Europe/Paris', country: 'France', abbreviation: 'CET' },
  'Dubai': { name: 'Dubai', timezone: 'Asia/Dubai', country: 'United Arab Emirates', abbreviation: 'GST' },
  'Tokyo': { name: 'Tokyo', timezone: 'Asia/Tokyo', country: 'Japan', abbreviation: 'JST' },
  'New York': { name: 'New York', timezone: 'America/New_York', country: 'United States', abbreviation: 'EST' },
  'Los Angeles': { name: 'Los Angeles', timezone: 'America/Los_Angeles', country: 'United States', abbreviation: 'PST' }
};

export default function WorldClockWidget() {
  const { worldClockCities, setWorldClockCities, isDarkMode } = useMacify();
  const [showSelector, setShowSelector] = useState(false);
  const [tick, setTick] = useState(0);

  // Periodic refresher to sync tick state
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleCity = (cityName: string) => {
    if (worldClockCities.includes(cityName)) {
      // Don't remove if it is the only one left
      if (worldClockCities.length <= 1) {
        return;
      }
      setWorldClockCities(worldClockCities.filter(c => c !== cityName));
    } else {
      setWorldClockCities([...worldClockCities, cityName]);
    }
  };

  const now = new Date();

  return (
    <div className="rounded-2xl border border-neutral-150 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20 p-3.5 space-y-3 shadow-inner">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
        <span className="font-extrabold text-xs tracking-tight flex items-center text-neutral-800 dark:text-neutral-200">
          <Globe size={13} className="mr-1.5 text-indigo-500 animate-[spin_8s_linear_infinite]" /> World Clock Widget
        </span>
        <button
          onClick={() => setShowSelector(!showSelector)}
          className={`cursor-pointer text-[10px] font-bold flex items-center px-2 py-0.5 rounded-full transition-all duration-200 ${
            showSelector 
              ? 'bg-rose-500 text-white shadow-sm' 
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200'
          }`}
        >
          {showSelector ? 'Done' : 'Manage Clocks +'}
        </button>
      </div>

      {/* Interactive Active Cities Selector Panel */}
      {showSelector && (
        <div className="p-2 border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 rounded-xl space-y-1.5 animate-[fadeIn_0.2s_ease-out]">
          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Select Cities to Monitor</p>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.keys(WORLD_CITIES_REGISTRY).map(cityName => {
              const active = worldClockCities.includes(cityName);
              return (
                <button
                  key={cityName}
                  onClick={() => toggleCity(cityName)}
                  className={`flex items-center justify-between px-2.5 py-1 text-[10px] font-semibold rounded-lg text-left cursor-pointer transition ${
                    active 
                      ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' 
                      : 'bg-white dark:bg-neutral-950/40 text-neutral-500 hover:bg-neutral-200/50 dark:border-neutral-850 border border-transparent'
                  }`}
                >
                  <span>{cityName}</span>
                  {active && <Check size={10} className="stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Clocks Grid Display */}
      <div className="grid grid-cols-1 gap-2">
        {worldClockCities.map(cityName => {
          const city = WORLD_CITIES_REGISTRY[cityName];
          if (!city) return null;

          // Calculate time
          let timeVal = '';
          let dateShort = '';
          let isDaytime = true;
          let diffStr = '';
          let dynamicAbbrev = city.abbreviation;

          try {
            // Clock string
            timeVal = now.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
              timeZone: city.timezone
            });

            dateShort = now.toLocaleDateString('en-US', {
              weekday: 'short',
              timeZone: city.timezone
            });

            // Day / night calculation
            const localTargetDate = new Date(now.toLocaleString('en-US', { timeZone: city.timezone }));
            const hours = localTargetDate.getHours();
            isDaytime = hours >= 6 && hours < 18;

            // Compute offset discrepancy
            const getOffsetSecs = (tz: string) => {
              const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' }).formatToParts(now);
              const oStr = parts.find(p => p.type === 'timeZoneName')?.value || 'GMT+0';
              const matches = oStr.match(/GMT([-+])(\d+)(?::(\d+))?/);
              if (!matches) return 0;
              const sign = matches[1] === '+' ? 1 : -1;
              const h = parseInt(matches[2], 10);
              const m = parseInt(matches[3] || '0', 10);
              return sign * (h * 3600 + m * 60);
            };

            const localOffsetSecs = -now.getTimezoneOffset() * 60;
            const targetOffsetSecs = getOffsetSecs(city.timezone);
            const diffHours = (targetOffsetSecs - localOffsetSecs) / 3600;

            if (diffHours === 0) {
              diffStr = 'Same time';
            } else {
              diffStr = `${diffHours > 0 ? '+' : ''}${diffHours} hr${Math.abs(diffHours) === 1 ? '' : 's'}`;
            }

            // Short abbreviation
            const partsAbbrev = new Intl.DateTimeFormat('en-US', { timeZone: city.timezone, timeZoneName: 'short' }).formatToParts(now);
            const tzPart = partsAbbrev.find(p => p.type === 'timeZoneName');
            if (tzPart) {
              dynamicAbbrev = tzPart.value;
            }
          } catch (e) {
            timeVal = '--:--';
            dateShort = '---';
          }

          return (
            <div
              key={cityName}
              className={`relative flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 overflow-hidden ${
                isDaytime 
                  ? 'bg-gradient-to-r from-sky-450/15 to-indigo-500/5 border-sky-400/10' 
                  : 'bg-gradient-to-r from-neutral-900/40 to-indigo-950/20 border-indigo-900/20'
              }`}
            >
              {/* City & Offset Description */}
              <div className="space-y-1 z-10">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-[12px] tracking-tight">{cityName}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-neutral-200/55 dark:bg-neutral-800/60 text-neutral-500 dark:text-neutral-400">
                    {dynamicAbbrev}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-[10px] text-neutral-450 font-medium">
                  <span>{city.country}</span>
                  <span>•</span>
                  <span className={diffStr.startsWith('+') ? 'text-teal-500 font-semibold' : diffStr.startsWith('-') ? 'text-amber-500 font-semibold' : ''}>
                    {diffStr}
                  </span>
                </div>
              </div>

              {/* Digital Time & Day Indicator */}
              <div className="flex items-center space-x-3.5 z-10">
                <div className="text-right">
                  <div className="font-mono text-xs font-bold leading-none tracking-tight">
                    {timeVal}
                  </div>
                  <div className="text-[9px] text-neutral-400 uppercase font-bold mt-1 tracking-wider">
                    {dateShort}
                  </div>
                </div>

                {/* Micro Ambient Indicator */}
                <div className={`p-1.5 rounded-full ${isDaytime ? 'bg-amber-100 text-amber-500' : 'bg-slate-800 text-indigo-400'} border border-white/5 shadow-md flex items-center justify-center`}>
                  {isDaytime ? <Sun size={10} className="animate-spin-slow" /> : <Moon size={10} />}
                </div>
              </div>

              {/* Subtle background world mesh pattern */}
              <div className="absolute right-0 top-0 bottom-0 opacity-[0.035] select-none pointer-events-none transform translate-y-3 translate-x-3 scale-110">
                <Compass size={84} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
