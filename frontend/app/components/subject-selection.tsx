"use client"

import { useState } from "react"
import { Subject, Course, MAX_FLASHCARDS } from "../data/subjects"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface SubjectSelectionProps {
  subjects: Subject[]
  onSelectCourse: (subject: Subject, course: Course, cardCount: number) => void
}

export default function SubjectSelection({ subjects, onSelectCourse }: SubjectSelectionProps) {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [cardCount, setCardCount] = useState<number>(0)

  const handleStartStudying = () => {
    if (selectedSubject && selectedCourse) {
      const maxCards = Math.min(selectedCourse.flashcards.length, MAX_FLASHCARDS);
      const actualCardCount = Math.min(
        cardCount || maxCards,
        maxCards
      )
      onSelectCourse(selectedSubject, selectedCourse, actualCardCount)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-800 mb-6">Choose a Subject</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {subjects.map((subject) => (
          <Card
            key={subject.id}
            className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedSubject?.id === subject.id
                ? "border-4 border-purple-400 bg-purple-50"
                : "border-2 border-gray-200 hover:border-purple-300"
            }`}
            onClick={() => {
              setSelectedSubject(subject)
              setSelectedCourse(null)
              setCardCount(0)
            }}
          >
            <div className="text-4xl mb-2">{subject.icon}</div>
            <h3 className="text-xl font-semibold text-purple-700">{subject.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{subject.courses.length} courses</p>
          </Card>
        ))}
      </div>

      {selectedSubject && (
        <>
          <h3 className="text-2xl font-bold text-purple-800 mb-4">Choose a Course</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {selectedSubject.courses.map((course) => (
              <Card
                key={course.id}
                className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedCourse?.id === course.id
                    ? "border-4 border-purple-400 bg-purple-50"
                    : "border-2 border-gray-200 hover:border-purple-300"
                }`}
                onClick={() => {
                  setSelectedCourse(course)
                  setCardCount(Math.min(course.flashcards.length, MAX_FLASHCARDS))
                }}
              >
                <h4 className="text-lg font-semibold text-purple-700">{course.name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {Math.min(course.flashcards.length, MAX_FLASHCARDS)} flashcards available
                </p>
              </Card>
            ))}
          </div>
        </>
      )}

      {selectedCourse && (
        <div className="mt-8 p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
          <h4 className="text-xl font-semibold text-purple-800 mb-4">Study Settings</h4>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-purple-700 mb-2">
                Number of Cards to Study (max: {Math.min(selectedCourse.flashcards.length, MAX_FLASHCARDS)})
              </label>
              <Input
                type="number"
                min={1}
                max={Math.min(selectedCourse.flashcards.length, MAX_FLASHCARDS)}
                value={cardCount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCardCount(Math.min(
                  Math.max(1, parseInt(e.target.value) || 0),
                  Math.min(selectedCourse.flashcards.length, MAX_FLASHCARDS)
                ))}
                className="w-full border-2 border-purple-200 rounded-lg p-2"
              />
            </div>
          </div>
          <Button
            onClick={handleStartStudying}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Start Studying
          </Button>
        </div>
      )}
    </div>
  )
} 