"use client"

import { useState, useEffect } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { ChevronLeft, ChevronRight, RotateCw, ArrowLeft, Menu } from "lucide-react"
import SubjectSelection from "./subject-selection"
import { subjects, Subject, Course } from "../data/subjects"
import Sidebar from "./Sidebar"

interface ViewedCard {
  front: string;
  back: string;
  index: number;
}

export default function FlashcardPage() {
  const [currentCard, setCurrentCard] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [viewedCards, setViewedCards] = useState<ViewedCard[]>([])
  const [studyCards, setStudyCards] = useState<Array<{front: string; back: string}>>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const flipCard = () => setIsFlipped(!isFlipped)

  const nextCard = () => {
    if (selectedCourse && currentCard < studyCards.length - 1) {
      // Add current card to viewed cards before moving to next
      if (!isFlipped) {
        const currentFlashcard = studyCards[currentCard];
        setViewedCards(prev => {
          const newCards = [...prev, { ...currentFlashcard, index: currentCard }];
          // Keep only last 4 cards
          return newCards.slice(-4);
        });
      }
      
      setCurrentCard(currentCard + 1)
      setIsFlipped(false)
      // Calculate progress based on completed cards (current card + 1)
      setProgress(((currentCard + 2) / studyCards.length) * 100)
    }
  }

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1)
      setIsFlipped(false)
      // Calculate progress based on current position
      setProgress(((currentCard) / studyCards.length) * 100)
    }
  }

  const handleCourseSelect = (subject: Subject, course: Course, cardCount: number) => {
    // Randomly select cardCount number of cards from the course
    const shuffled = [...course.flashcards].sort(() => 0.5 - Math.random());
    const selectedCards = shuffled.slice(0, cardCount);
    
    setSelectedSubject(subject)
    setSelectedCourse(course)
    setStudyCards(selectedCards)
    setCurrentCard(0)
    // Set initial progress to show first card (1/total)
    setProgress((1 / cardCount) * 100)
    setIsFlipped(false)
    setViewedCards([])
  }

  const handleBack = () => {
    setSelectedSubject(null)
    setSelectedCourse(null)
    setStudyCards([])
    setCurrentCard(0)
    setProgress(0)
    setIsFlipped(false)
    setViewedCards([])
  }

  if (!selectedCourse) {
    return (
      <>
        <Button
          onClick={() => setIsSidebarOpen(true)}
          variant="default"
          className="fixed top-4 left-4 z-50 p-2"
        >
          <Menu className="h-6 w-6 text-purple-600" />
        </Button>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <SubjectSelection subjects={subjects} onSelectCourse={handleCourseSelect} />
      </>
    )
  }

  return (
    <>
      <Button
        onClick={() => setIsSidebarOpen(true)}
        variant="default"
        className="fixed top-4 left-4 z-50 p-2"
      >
        <Menu className="h-6 w-6 text-purple-600" />
      </Button>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex items-center mb-8">
          <Button
            onClick={handleBack}
            variant="default"
            className="mr-4 text-purple-700 hover:text-purple-900"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-purple-800">{selectedSubject?.name}</h2>
            <p className="text-purple-600">
              {selectedCourse.name} ({studyCards.length} cards)
            </p>
          </div>
        </div>

        <Card
          className="mb-6 h-64 cursor-pointer bg-white p-6 text-center shadow-2xl transition-all duration-500 ease-in-out hover:scale-105 border-4 border-purple-400 rounded-2xl overflow-hidden"
          onClick={flipCard}
        >
          <div
            className={`transform transition-all duration-500 ${isFlipped ? "rotate-y-180" : ""} h-full flex items-center justify-center`}
          >
            <div className="backface-hidden absolute w-full">
              <p className="text-2xl font-semibold text-purple-700">
                {isFlipped ? studyCards[currentCard].back : studyCards[currentCard].front}
              </p>
            </div>
          </div>
        </Card>

        <div className="mb-6 flex justify-between">
          <Button
            onClick={prevCard}
            disabled={currentCard === 0}
            variant="outline"
            className="text-purple-700 bg-yellow-200 hover:bg-yellow-300 border-2 border-yellow-400 rounded-full p-2"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            onClick={flipCard}
            variant="outline"
            className="text-purple-700 bg-green-200 hover:bg-green-300 border-2 border-green-400 rounded-full p-2"
          >
            <RotateCw className="h-6 w-6" />
          </Button>
          <Button
            onClick={nextCard}
            disabled={currentCard === studyCards.length - 1}
            variant="outline"
            className="text-purple-700 bg-pink-200 hover:bg-pink-300 border-2 border-pink-400 rounded-full p-2"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-purple-600">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <Progress
            value={progress}
            className="h-3 w-full bg-purple-200 rounded-full"
            indicatorClassName="bg-purple-600 rounded-full"
          />
        </div>
        
        <p className="mt-4 text-center text-sm text-purple-600">
          Card {currentCard + 1} / {studyCards.length}
        </p>

        {viewedCards.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Previous Cards</h3>
            <div className="grid grid-cols-2 gap-4">
              {viewedCards.map((card, index) => (
                <Card
                  key={index}
                  className="p-4 bg-green-50 border-2 border-green-200 cursor-pointer hover:border-green-300 transition-all duration-300"
                  onClick={() => {
                    setCurrentCard(card.index);
                    setIsFlipped(false);
                  }}
                >
                  <p className="text-sm text-purple-700 line-clamp-2">{card.front}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
} 