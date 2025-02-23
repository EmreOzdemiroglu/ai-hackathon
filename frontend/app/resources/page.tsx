'use client';

import { useState } from 'react';
import { FaSearch, FaPlay, FaBookOpen } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import './resources.css';

type Subject = 'Mathematics' | 'Science';
type Topics = {
  [K in Subject]: string[];
};

type Video = {
  title: string;
  description: string;
};

type VideoLists = {
  [key: string]: Video[];
};

export default function ResourcesPage() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | ''>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([
    'Math: Addition',
    'Science: Plants',
    'English: Verbs'
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);

  const subjects: Topics = {
    Mathematics: ['Addition', 'Subtraction', 'Multiplication', 'Division'],
    Science: ['Plants', 'Animals', 'Weather', 'Space']
  };

  const videoLists: VideoLists = {
    'Math: Addition': [
      {
        title: "Fun Addition Video!",
        description: "Watch this fun video to learn more about addition"
      },
      {
        title: "Addition with Examples",
        description: "Learn addition with real-world examples"
      },
      {
        title: "Addition Games and Practice",
        description: "Interactive video with practice exercises"
      },
      {
        title: "Basic Addition Tips",
        description: "Helpful tips for learning addition"
      },
      {
        title: "Addition with Numbers 1-10",
        description: "Practice adding numbers from 1 to 10"
      },
      {
        title: "Addition Story Problems",
        description: "Learn to solve addition word problems"
      },
      {
        title: "Visual Addition Guide",
        description: "Visual methods for understanding addition"
      },
      {
        title: "Addition Tricks",
        description: "Quick tricks for adding numbers"
      }
    ],
    'Science: Plants': [
      {
        title: "Introduction to Plants",
        description: "Learn about different types of plants"
      },
      {
        title: "How Plants Grow",
        description: "Understanding plant growth and life cycle"
      },
      {
        title: "Plant Parts",
        description: "Learn about roots, stems, leaves, and flowers"
      },
      {
        title: "Photosynthesis",
        description: "How plants make their own food"
      }
    ]
  };

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    if (subjects[subject]) {
      setSelectedTopic(subjects[subject][0]);
    }
    setIsBrowseOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Browse Modal */}
      {isBrowseOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 relative">
            <button 
              onClick={() => setIsBrowseOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold mb-6">Browse Subjects</h2>
            
            <div className="grid grid-cols-2 gap-6">
              {Object.keys(subjects).map((subject) => (
                <div 
                  key={subject}
                  onClick={() => handleSubjectSelect(subject as Subject)}
                  className="bg-white border-2 border-purple-100 rounded-xl p-6 cursor-pointer hover:border-purple-500 transition-colors"
                >
                  <h3 className="text-xl font-semibold text-purple-800 mb-2">{subject}</h3>
                  <div className="space-y-2">
                    {subjects[subject as Subject].map((topic) => (
                      <p key={topic} className="text-gray-600">{topic}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col p-6 gap-6 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bars3Icon className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600 transition-colors">
            <FaBookOpen className="w-5 h-5" />
            <span>New Topic</span>
          </button>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar - Browse Section */}
          <div className="w-[300px] flex-shrink-0 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search topics..."
                className="w-full p-3 pl-10 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Browse Button */}
            <button 
              onClick={() => setIsBrowseOpen(true)}
              className="w-full bg-purple-600 text-white p-3 rounded-xl font-medium hover:bg-purple-700 transition-colors"
            >
              Browse
            </button>

            {/* Subject List */}
            {selectedSubject && (
              <div className="bg-white rounded-xl p-4">
                <h3 className="font-medium text-purple-800 mb-3">{selectedSubject} Topics</h3>
                <div className="space-y-1">
                  {subjects[selectedSubject as Subject].map((topic) => (
                    <button
                      key={topic}
                      className={`w-full text-left p-2 rounded-lg transition-colors ${
                        selectedTopic === topic
                          ? 'bg-purple-100 text-purple-700'
                          : 'hover:bg-gray-50 text-gray-600'
                      }`}
                      onClick={() => setSelectedTopic(topic)}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recently Viewed */}
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-medium text-purple-800 mb-3">Recently Viewed</h3>
              <div className="space-y-1">
                {recentlyViewed.map((topic, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Topic Header */}
            <div className="mb-6">
              {selectedSubject && (
                <span className="inline-block bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-medium mb-2">
                  {selectedSubject}
                </span>
              )}
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedSubject}: {selectedTopic}
              </h1>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              {selectedSubject && selectedTopic ? (
                <>
                  <h2 className="text-2xl font-bold mb-4">Let's Learn {selectedTopic}!</h2>
                  <p className="text-gray-600 text-lg mb-6">
                    Hi there! Today we're going to learn about {selectedTopic.toLowerCase()}.
                  </p>

                  {/* Dynamic content based on selection */}
                  {/* You can add more conditional content here */}
                </>
              ) : (
                <p className="text-gray-500">Please select a subject and topic to start learning.</p>
              )}
            </div>
          </div>

          {/* Right Sidebar - Helpful Resources */}
          <div className="w-[380px] flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Helpful Resources</h2>
              <div className="overflow-hidden">
                <div className="space-y-6 h-[640px] overflow-y-auto pr-4 custom-scrollbar">
                  {(videoLists[`${selectedSubject}: ${selectedTopic}`] || []).map((video, index) => (
                    <div key={index} className="group">
                      <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center mb-3 group-hover:bg-gray-200 transition-colors cursor-pointer">
                        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-700 transition-colors">
                          <FaPlay className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                      <h3 className="font-semibold mb-1 group-hover:text-purple-600 transition-colors">{video.title}</h3>
                      <p className="text-gray-600 text-sm">{video.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 