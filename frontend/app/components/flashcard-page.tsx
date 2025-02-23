"use client"

import { useState } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react"

const flashcards = [
  { front: "Fransa'nın başkenti neresidir?", back: "Paris" },
  { front: "2 + 2 kaç eder?", back: "4" },
  { front: "Gökyüzü hangi renktir?", back: "Mavi" },
  // Daha fazla flashcard ekleyin
]

export default function FlashcardPage() {
  const [currentCard, setCurrentCard] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [progress, setProgress] = useState(0)

  const flipCard = () => setIsFlipped(!isFlipped)

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1)
      setIsFlipped(false)
      setProgress(((currentCard + 1) / flashcards.length) * 100)
    }
  }

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1)
      setIsFlipped(false)
      setProgress(((currentCard - 1) / flashcards.length) * 100)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <h1 className="mb-8 text-4xl font-bold text-purple-800 font-comic-sans animate-bounce">Eğlenceli Flashcards</h1>
      <Card
        className="mb-6 h-64 cursor-pointer bg-white p-6 text-center shadow-2xl transition-all duration-500 ease-in-out hover:scale-105 border-4 border-purple-400 rounded-2xl overflow-hidden"
        onClick={flipCard}
      >
        <div
          className={`transform transition-all duration-500 ${isFlipped ? "rotate-y-180" : ""} h-full flex items-center justify-center`}
        >
          <div className="backface-hidden absolute w-full">
            <p className="text-2xl font-semibold text-purple-700">
              {isFlipped ? flashcards[currentCard].back : flashcards[currentCard].front}
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
          disabled={currentCard === flashcards.length - 1}
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
              İlerleme
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-purple-600">{Math.round(progress)}%</span>
          </div>
        </div>
        <Progress
          value={progress}
          className="h-3 w-full bg-purple-200 rounded-full"
          indicatorClassName="bg-purple-600 rounded-full"
        />
      </div>
      <p className="mt-4 text-center text-sm text-purple-600">
        Kart {currentCard + 1} / {flashcards.length}
      </p>
    </div>
  )
} 