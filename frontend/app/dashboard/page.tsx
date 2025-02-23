'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import learningImage from '../assets/images/Learning-cuate.png';
import Sidebar from '../components/Sidebar';
import PomodoroTimer from '../components/PomodoroTimer';
import { useUser } from '../hooks/useUser';

export default function Dashboard() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState('week');
  const { theme, setTheme } = useTheme();
  const { user, loading } = useUser();
  
  const recentTopics = [
    { id: 1, title: 'Technology', progress: 25 },
    { id: 2, title: 'Ecology', progress: 44 },
    { id: 3, title: 'Real estate', progress: 40 },
    { id: 4, title: 'Education', progress: 15 },
    { id: 5, title: 'Job market', progress: 76 },
  ];

  const timeSpentData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { label: 'Vocabulary', data: [2, 1, 3, 2, 1, 0, 2] },
      { label: 'Grammar', data: [1, 3, 2, 1, 2, 3, 1] },
      { label: 'Listening', data: [2, 2, 1, 3, 1, 2, 2] },
      { label: 'Writing', data: [1, 1, 2, 1, 2, 1, 1] },
    ]
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      {/* Left Sidebar */}
      <Sidebar isOpen={isLeftSidebarOpen} onClose={() => setIsLeftSidebarOpen(false)} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isLeftSidebarOpen ? 'ml-96' : 'ml-0'} ${isRightSidebarOpen ? 'mr-96' : 'mr-0'}`}>
        {/* Top Bar */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <button
              onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
              className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 mr-6"
            >
              <svg className="w-8 h-8 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-3xl font-semibold dark:text-white">Dashboard</h1>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-8 h-8 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="m-6 p-8 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-semibold mb-4 text-pink-500 dark:text-pink-300">
                {loading ? 'Loading...' : `Welcome back ${user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : 'Guest'}!`}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                You've learned 80% of your goal this week!<br />
                Keep it up and improve your results!
              </p>
            </div>
            <div className="w-64 h-64 relative">
              <Image
                src={learningImage}
                alt="Learning illustration"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Pomodoro Timer */}
        <div className="mx-6 mb-6">
          <PomodoroTimer />
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Recent Topics */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold dark:text-white">Recent Topics</h3>
              <button className="text-xl text-purple-600 dark:text-purple-400 hover:underline">More →</button>
            </div>
            <div className="space-y-6">
              {recentTopics.map((topic) => (
                <div key={topic.id} className="flex items-center justify-between">
                  <span className="text-xl text-gray-700 dark:text-gray-300">{topic.title}</span>
                  <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full"
                      style={{ width: `${topic.progress}%` }}
                    />
                  </div>
                  <span className="text-lg text-gray-500 dark:text-gray-400">{topic.progress}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Time Spent on Learning */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold dark:text-white">Time Spent on Learning</h3>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-gray-100 dark:bg-gray-700 border-none rounded-lg px-4 py-2 text-lg"
              >
                <option value="day">Last Day</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
            </div>
            <div className="h-80 relative">
              {/* Here you would implement the actual chart using a library like Chart.js or Recharts */}
              <div className="flex justify-between h-full">
                {timeSpentData.labels.map((day, index) => (
                  <div key={day} className="flex flex-col justify-end items-center w-12">
                    <div className="w-3 bg-purple-600 rounded-t" style={{ height: '60%' }} />
                    <span className="text-sm mt-3 text-gray-500 dark:text-gray-400">{day}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-6 space-x-6">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-400 rounded-full mr-3" />
                <span className="text-lg text-gray-600 dark:text-gray-400">Vocabulary</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-600 rounded-full mr-3" />
                <span className="text-lg text-gray-600 dark:text-gray-400">Grammar</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-400 rounded-full mr-3" />
                <span className="text-lg text-gray-600 dark:text-gray-400">Listening</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-30 w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-6">
              <Image
                src={learningImage}
                alt="Profile"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            <h3 className="text-2xl font-semibold dark:text-white mb-2">
              {loading ? 'Loading...' : user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : 'Guest'}
            </h3>
            <p className="text-xl text-gray-500 dark:text-gray-400">Student</p>
            
            <div className="w-full mt-12">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl text-gray-700 dark:text-gray-300">Dark Mode</span>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full relative"
                >
                  <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${theme === 'dark' ? 'translate-x-9' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}