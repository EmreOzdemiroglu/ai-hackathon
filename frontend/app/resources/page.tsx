'use client';

import { useState, useEffect } from 'react';
import { FaPlay, FaBookOpen } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './resources.css';

type Subject = string;
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
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string>('');
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([
    'Math: Addition',
    'Science: Plants',
    'English: Verbs'
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Login and get token on component mount
  useEffect(() => {
    const login = async () => {
      try {
        const formData = new URLSearchParams();
        formData.append('username', 'demo_user'); // Replace with actual credentials
        formData.append('password', 'demo_password'); // Replace with actual credentials

        const response = await fetch('http://localhost:8000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();
        setAuthToken(data.access_token);
      } catch (error) {
        console.error('Login error:', error);
      }
    };

    login();
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/subjects/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when a category is selected
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!selectedCategory) {
        setSubcategories([]);
        return;
      }
      try {
        const response = await fetch(`http://localhost:8000/api/subjects/subcategories/${encodeURIComponent(selectedCategory)}`);
        const data = await response.json();
        setSubcategories(data);
        // Reset selected subcategory when category changes
        setSelectedSubcategory('');
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };
    fetchSubcategories();
  }, [selectedCategory]);

  // Modified useEffect for fetching explanation
  useEffect(() => {
    const fetchExplanation = async () => {
      if (!selectedSubcategory || !authToken) {
        setExplanation('');
        return;
      }

      setIsLoading(true);
      try {
        // First try to get from cache
        const cacheResponse = await fetch(`http://localhost:8000/api/cache/explanation/${encodeURIComponent(selectedSubcategory)}`);
        const cacheData = await cacheResponse.json();

        if (cacheData.explanation) {
          setExplanation(cacheData.explanation);
        } else {
          // If not in cache, get from chat endpoint
          const formData = new FormData();
          formData.append('message', `I don't understand ${selectedSubcategory}. Can you explain it to me?`);

          const chatResponse = await fetch('http://localhost:8000/chat', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authToken}`,
            },
            body: formData,
          });

          if (!chatResponse.ok) {
            throw new Error('Chat request failed');
          }

          const chatData = await chatResponse.json();

          // Cache the response
          await fetch(`http://localhost:8000/api/cache/explanation/${encodeURIComponent(selectedSubcategory)}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ explanation: chatData.response }),
          });

          setExplanation(chatData.response);
        }
      } catch (error) {
        console.error('Error fetching explanation:', error);
        setExplanation('Failed to load explanation. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExplanation();
  }, [selectedSubcategory, authToken]);

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

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
            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Dropdown - Only show when category is selected */}
            {selectedCategory && (
              <div className="relative">
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="w-full p-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a Subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
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
              {selectedCategory && (
                <span className="inline-block bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-medium mb-2">
                  {selectedCategory}
                </span>
              )}
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedCategory && selectedSubcategory 
                  ? `${selectedCategory}: ${selectedSubcategory}`
                  : 'Select a category and subcategory'}
              </h1>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              {selectedCategory && selectedSubcategory ? (
                <>
                  <h2 className="text-2xl font-bold mb-4">Let's Learn {selectedSubcategory}!</h2>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    </div>
                  ) : (
                    <div className="prose prose-lg max-w-none prose-headings:text-purple-900 prose-a:text-purple-600 prose-strong:text-purple-900 prose-code:text-purple-800 prose-pre:bg-purple-50">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {explanation}
                      </ReactMarkdown>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500">Please select a category and subcategory to start learning.</p>
              )}
            </div>
          </div>

          {/* Right Sidebar - Helpful Resources */}
          <div className="w-[380px] flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Helpful Resources</h2>
              <div className="overflow-hidden">
                <div className="space-y-6 h-[640px] overflow-y-auto pr-4 custom-scrollbar">
                  {(videoLists[`${selectedCategory}: ${selectedSubcategory}`] || []).map((video, index) => (
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