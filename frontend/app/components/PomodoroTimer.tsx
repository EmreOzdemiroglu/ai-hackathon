'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import Image from 'next/image';
import lemon1 from '../assets/images/lemon1.png';
import lemon2 from '../assets/images/lemon2.png';

interface TimerOption {
  id: string;
  work: number;
  break: number;
  label: string;
}

const timerOptions: TimerOption[] = [
  {
    id: '25-5',
    work: 25,
    break: 5,
    label: 'Quick Focus',
  },
  {
    id: '50-10',
    work: 50,
    break: 10,
    label: 'Deep Work',
  },
  {
    id: '90-15',
    work: 90,
    break: 15,
    label: 'Extended Flow',
  },
];

export default function PomodoroTimer() {
  const [selectedOption, setSelectedOption] = useState<TimerOption>(timerOptions[0]);
  const [timeLeft, setTimeLeft] = useState(selectedOption.work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (!isBreak) {
        setTimeLeft(selectedOption.break * 60);
        setIsBreak(true);
      } else {
        setTimeLeft(selectedOption.work * 60);
        setIsBreak(false);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, selectedOption]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleOptionChange = (option: TimerOption) => {
    setSelectedOption(option);
    setTimeLeft(option.work * 60);
    setIsBreak(false);
    setIsRunning(false);
    setShowOptions(false);
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setTimeLeft(selectedOption.work * 60);
    setIsRunning(false);
    setIsBreak(false);
  };

  const progress = isBreak
    ? (timeLeft / (selectedOption.break * 60)) * 100
    : (timeLeft / (selectedOption.work * 60)) * 100;

  // Calculate slice visibility - slices are either fully visible or invisible
  const getSliceOpacity = (sliceIndex: number) => {
    const totalSlices = 12;
    const progressPerSlice = 100 / totalSlices;
    const sliceProgress = (100 - progress) / progressPerSlice;
    return sliceIndex >= Math.floor(sliceProgress) ? 0 : 1;
  };

  return (
    <div className="w-full bg-[#e8f5e3] p-8 rounded-xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">Focus Timer</h2>
      <div className="flex items-center justify-center gap-16">
        {/* Left button */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={toggleTimer}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            {isRunning ? <Pause className="h-6 w-6 text-gray-600" /> : <Play className="h-6 w-6 ml-1 text-gray-600" />}
          </button>
          <span className="text-sm font-medium text-gray-600">Start</span>
        </div>

        {/* Timer */}
        <div className="relative">
          <button
            onClick={() => !isRunning && setShowOptions(!showOptions)}
            className={cn(
              "relative w-64 h-64 rounded-full transition-transform",
              !isRunning && "hover:scale-105 active:scale-95",
              isRunning && "cursor-default",
            )}
          >
            {/* Main circle with shadow */}
            <div className="absolute inset-0 rounded-full bg-white shadow-xl" />

            {/* Background lemon */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <Image
                src={lemon1}
                alt="Lemon background"
                layout="fill"
                objectFit="cover"
              />
            </div>

            {/* Lemon slices container */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {Array.from({ length: 12 }).map((_, index) => {
                const rotation = (index * 360) / 12;
                return (
                  <div
                    key={index}
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                      clipPath: `conic-gradient(from ${rotation}deg at 50% 50%, #FFD700 ${30}deg, transparent ${30}deg)`,
                      opacity: getSliceOpacity(index),
                      backgroundImage: `url(${lemon2.src})`,
                      backgroundSize: 'cover',
                      transform: `rotate(${rotation}deg)`,
                    }}
                  />
                );
              })}
            </div>

            {/* Timer display or options */}
            <div className="absolute inset-0 flex items-center justify-center">
              {showOptions ? (
                <div className="bg-white/95 backdrop-blur-sm absolute inset-8 rounded-full flex flex-col items-center justify-center gap-3 transition-all duration-200">
                  {timerOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptionChange(option);
                      }}
                      className={cn(
                        "w-40 py-2 px-3 rounded-full transition-all text-left",
                        "hover:bg-[#E8F5E3]",
                        selectedOption.id === option.id && "bg-[#E8F5E3] font-medium"
                      )}
                    >
                      <div className="text-sm text-gray-800">{option.label}</div>
                      <div className="text-xs text-gray-500">
                        {option.work}min / {option.break}min
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center z-10 bg-white/80 rounded-full p-6">
                  <div className="text-4xl font-bold text-gray-800 mb-1">
                    {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{isBreak ? "Break Time" : "Focus Time"}</div>
                  {!isRunning && <div className="text-xs text-gray-400 mt-1">Click to change timer</div>}
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Right button */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={resetTimer}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <RotateCcw className="h-6 w-6 text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-600">Reset</span>
        </div>
      </div>
    </div>
  );
} 