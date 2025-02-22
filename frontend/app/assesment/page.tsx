'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

interface Question {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  hint?: string;
  type: 'multiple-choice' | 'text' | 'pattern' | 'rating' | 'ordered-text' | 'logic-puzzle';
  scaffolding?: string;
}

const primarySchoolQuestions: Question[] = [
  {
    id: 'verbal1',
    question: 'Arrange the steps to build a birdhouse in the correct order. Write your answer using the format: X → Y → Z',
    options: [
      '(A) Paint the birdhouse.',
      '(B) Hammer the nails into the wood.',
      '(C) Draw a design on paper.',
      '(D) Let the paint dry.',
      '(E) Put the pieces together.'
    ],
    correctAnswer: 'C → B → E → A → D',
    hint: 'What do you do first—plan or build?',
    type: 'ordered-text'
  },
  {
    id: 'verbal2',
    question: 'What does "predict" mean?',
    options: [
      'To guess what will happen next',
      'To forget something',
      'To draw a picture'
    ],
    correctAnswer: 'To guess what will happen next',
    hint: 'If I say it will rain tomorrow, I\'m ______ing the weather.',
    type: 'multiple-choice'
  },
  {
    id: 'nonverbal1',
    question: 'Complete the pattern: △ ▢ △ ▢ ○ △ ▢ ___',
    options: ['△', '▢', '○'],
    correctAnswer: '△',
    hint: 'Look at the shapes—do they repeat in a special order?',
    type: 'pattern'
  },
  {
    id: 'logic1',
    question: 'Why did the ice cream melt?',
    options: [
      'It was in the freezer',
      'It was left in the sun',
      'It was wrapped in a blanket'
    ],
    correctAnswer: 'It was left in the sun',
    type: 'multiple-choice'
  },
  {
    id: 'logic2',
    question: 'Complete the pair: Hand is to glove, as foot is to _____.',
    options: ['Sock', 'Shoe', 'Hat'],
    correctAnswer: 'Sock',
    hint: 'What do you wear on your feet?',
    type: 'multiple-choice'
  }
];

const secondarySchoolQuestions: Question[] = [
  {
    id: 'verbal1',
    question: 'Plan a science experiment: Arrange these steps logically.',
    options: [
      '(A) Record the results.',
      '(B) Form a hypothesis.',
      '(C) Gather materials.',
      '(D) Analyze the data.',
      '(E) Test the hypothesis.'
    ],
    correctAnswer: 'B → C → E → A → D',
    type: 'ordered-text'
  },
  {
    id: 'verbal2',
    question: 'What does \'hypothesis\' mean?',
    options: [
      'A proven fact',
      'An educated guess',
      'A type of graph'
    ],
    correctAnswer: 'An educated guess',
    type: 'multiple-choice'
  },
  {
    id: 'nonverbal1',
    question: 'What\'s missing in the pattern?',
    options: ['◻️', '◼️', '◯'],
    correctAnswer: '◻️',
    hint: 'Look for symmetry in rows and columns.',
    type: 'pattern',
    scaffolding: `Pattern:
◻️◼️◻️
◼️?◼️
◻️◼️◻️`
  },
  {
    id: 'logic1',
    question: 'If all planets orbit stars, and Earth orbits the Sun, is Earth a planet?',
    options: [
      'Yes',
      'No',
      'Not enough info'
    ],
    correctAnswer: 'Yes',
    scaffolding: 'What category does Earth fit into?',
    type: 'multiple-choice'
  },
  {
    id: 'logic2',
    question: 'Amy, Ben, and Cara each have a favorite subject: math, history, or art.\nAmy doesn\'t like math or history.\nBen\'s favorite subject isn\'t art.\nWhat is Cara\'s favorite subject?',
    options: [
      'Math',
      'History',
      'Art'
    ],
    correctAnswer: 'History',
    type: 'logic-puzzle'
  }
];

export default function Assessment() {
  const router = useRouter();
  const [age, setAge] = useState<string>("6");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<Record<string, number>>({
    followInstructions: 0,
    solvePuzzles: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(primarySchoolQuestions);

  useEffect(() => {
    if (age) {
      const ageNum = parseInt(age);
      if (ageNum >= 6 && ageNum <= 12) {
        setQuestions(primarySchoolQuestions);
      } else if (ageNum >= 13 && ageNum <= 18) {
        setQuestions(secondarySchoolQuestions);
      } else {
        setQuestions([]);
      }
    }
  }, [age]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleRatingChange = (type: string, value: number) => {
    setRatings(prev => ({ ...prev, [type]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const assessmentData = {
        age,
        answers,
        ratings
      };

      console.log('Assessment submitted:', assessmentData);
      toast.success('Assessment completed successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to submit assessment. Please try again.');
      console.error('Assessment submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 whitespace-pre-line">{question.question}</h3>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {question.scaffolding && (
              <p className="text-sm text-gray-500 mt-2">Hint: {question.scaffolding}</p>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">{question.question}</h3>
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500"
              placeholder="Write your answer here..."
            />
            {question.hint && (
              <p className="text-sm text-gray-500">Hint: {question.hint}</p>
            )}
          </div>
        );

      case 'pattern':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">{question.question}</h3>
            {question.scaffolding && (
              <pre className="font-mono text-lg mb-4 bg-gray-50 p-4 rounded-lg">
                {question.scaffolding}
              </pre>
            )}
            <div className="flex space-x-4">
              {question.options?.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleAnswerChange(question.id, option)}
                  className={`p-4 rounded-lg border-2 text-2xl ${
                    answers[question.id] === option
                      ? 'bg-purple-100 border-purple-500'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {question.hint && (
              <p className="text-sm text-gray-500">Hint: {question.hint}</p>
            )}
          </div>
        );

      case 'ordered-text':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">{question.question}</h3>
            <div className="space-y-2 mb-4">
              {question.options?.map((option, index) => (
                <div key={index} className="text-gray-700">
                  {option}
                </div>
              ))}
            </div>
            <input
              type="text"
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500"
              placeholder="Enter your answer (e.g., A → B → C)"
            />
            {question.hint && (
              <p className="text-sm text-gray-500 mt-2">Hint: {question.hint}</p>
            )}
          </div>
        );

      case 'logic-puzzle':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 whitespace-pre-line">{question.question}</h3>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-purple-600 mb-8">NVLD Assessment</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Age Input */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Please select your age:</h2>
            <div className="relative pt-8 pb-6">
              {/* Age Labels */}
              <div className="flex justify-between mb-2">
                <span className="text-lg font-medium text-purple-600">6</span>
                <span className="text-lg font-medium text-purple-600">18</span>
              </div>
              {/* Custom Range Input */}
              <input
                type="range"
                min="6"
                max="18"
                value={age || "6"}
                onChange={(e) => setAge(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 
                [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-purple-600 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 
                [&::-moz-range-thumb]:bg-purple-600 [&::-moz-range-thumb]:border-0 
                [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
              />
              {/* Selected Age Display */}
              <div className="text-center mt-4">
                <span className="text-lg font-medium text-gray-900">Selected Age: {age || "6"}</span>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          {age && questions.length > 0 && (
            <div className="space-y-8">
              {questions.map((question) => (
                <div key={question.id} className="border-b pb-6">
                  {renderQuestion(question)}
                </div>
              ))}

              {/* Self Assessment Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Self Assessment</h2>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    How easy is it for you to follow instructions without pictures?
                  </h3>
                  <div className="flex space-x-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleRatingChange('followInstructions', value)}
                        className={`w-10 h-10 rounded-full ${
                          ratings.followInstructions === value
                            ? 'bg-yellow-400'
                            : 'bg-gray-200'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    How good are you at solving puzzles like matching shapes?
                  </h3>
                  <div className="flex space-x-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleRatingChange('solvePuzzles', value)}
                        className={`w-10 h-10 rounded-full ${
                          ratings.solvePuzzles === value
                            ? 'bg-green-400'
                            : 'bg-gray-200'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !age || questions.length === 0}
            className={`w-full sm:w-auto px-8 py-3 bg-purple-600 text-white rounded-lg 
              ${(isSubmitting || !age || questions.length === 0) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-700'}
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answers'}
          </button>
        </form>
      </div>
    </div>
  );
}