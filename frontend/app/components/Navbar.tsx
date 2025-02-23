'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, BookOpenIcon, AcademicCapIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Resources', href: '/resources', icon: BookOpenIcon },
  { name: 'Assessment', href: '/assessment', icon: AcademicCapIcon },
  { name: 'Chat', href: '/chatbot', icon: ChatBubbleLeftIcon },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white rounded-lg p-2 shadow-lg"
      >
        {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
      </button>
      
      <nav className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed top-0 left-0 h-screen bg-white shadow-lg flex flex-col transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? 'w-64' : 'w-0'
      } md:translate-x-0 md:w-64`}>
        <div className="p-4">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <span className="font-bold text-xl text-purple-700">VerbAI</span>
          </Link>
        </div>

        <div className="flex-1 px-2 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-purple-100 text-purple-600'
                    : 'hover:bg-pink-50 text-gray-600 hover:text-purple-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
} 