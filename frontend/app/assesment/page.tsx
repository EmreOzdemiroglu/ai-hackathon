'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { createLearningProfile, getLearningProfile } from '../services/api';

interface Question {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  hint?: string;
  type: 'multiple-choice' | 'text' | 'pattern' | 'rating' | 'ordered-text' | 'ordered-number' | 'logic-puzzle';
  scaffolding?: string;
}

const primarySchoolQuestions: Question[] = [
  // Question 1 - Verbal Ordering (ID: verbal1)
  {
    id: 'verbal1',
    question: '1. Arrange the steps to build a birdhouse in the correct order by selecting numbers from 1 to 5 for each step.',
    options: [
      'Paint the birdhouse.',
      'Hammer the nails into the wood.',
      'Draw a design on paper.',
      'Let the paint dry.',
      'Put the pieces together.'
    ],
    correctAnswer: '3,2,5,1,4',
    hint: 'What do you do first—plan or build?',
    type: 'ordered-number'
  },
  // Question 2 - Verbal Definition (ID: verbal2)
  {
    id: 'verbal2',
    question: '2. What does "predict" mean?',
    options: [
      'To guess what will happen next',
      'To forget something',
      'To draw a picture'
    ],
    correctAnswer: 'To guess what will happen next',
    hint: 'If I say it will rain tomorrow, I\'m ______ing the weather.',
    type: 'multiple-choice'
  },
  // Question 3 - Non-verbal Pattern (ID: nonverbal1)
  {
    id: 'nonverbal1',
    question: '3. Complete the pattern: △ ▢ △ ▢ ○ △ ▢ ___',
    options: ['△', '▢', '○'],
    correctAnswer: '△',
    hint: 'Look at the shapes—do they repeat in a special order?',
    type: 'pattern'
  },
  // Question 4 - Logic Multiple Choice (ID: logic1)
  {
    id: 'logic1',
    question: '4. Why did the ice cream melt?',
    options: [
      'It was in the freezer',
      'It was left in the sun',
      'It was wrapped in a blanket'
    ],
    correctAnswer: 'It was left in the sun',
    type: 'multiple-choice'
  },
  // Question 5 - Logic Analogy (ID: logic2)
  {
    id: 'logic2',
    question: '5. Complete the pair: Hand is to glove, as foot is to _____.',
    options: ['Sock', 'Shoe', 'Hat'],
    correctAnswer: 'Sock',
    hint: 'What do you wear on your feet?',
    type: 'multiple-choice'
  }
];

const secondarySchoolQuestions: Question[] = [
  // Question 1 - Verbal Ordering (ID: verbal1)
  {
    id: 'verbal1',
    question: '1. Plan a science experiment: Arrange these steps logically by selecting numbers from 1 to 5 for each step.',
    options: [
      'Record the results.',
      'Form a hypothesis.',
      'Gather materials.',
      'Analyze the data.',
      'Test the hypothesis.'
    ],
    correctAnswer: '2,3,5,1,4',
    type: 'ordered-number'
  },
  // Question 2 - Verbal Definition (ID: verbal2)
  {
    id: 'verbal2',
    question: '2. What does \'hypothesis\' mean?',
    options: [
      'A proven fact',
      'An educated guess',
      'A type of graph'
    ],
    correctAnswer: 'An educated guess',
    type: 'multiple-choice'
  },
  // Question 3 - Non-verbal Pattern (ID: nonverbal1)
  {
    id: 'nonverbal1',
    question: '3. What\'s missing in the pattern?',
    options: ['◻️', '◼️', '◯'],
    correctAnswer: '◻️',
    hint: 'Look for symmetry in rows and columns.',
    type: 'pattern',
    scaffolding: `Pattern:
◻️◼️◻️
◼️?◼️
◻️◼️◻️`
  },
  // Question 4 - Logic Multiple Choice (ID: logic1)
  {
    id: 'logic1',
    question: '4. If all planets orbit stars, and Earth orbits the Sun, is Earth a planet?',
    options: [
      'Yes',
      'No',
      'Not enough info'
    ],
    correctAnswer: 'Yes',
    scaffolding: 'What category does Earth fit into?',
    type: 'multiple-choice'
  },
  // Question 5 - Logic Puzzle (ID: logic2)
  {
    id: 'logic2',
    question: '5. Amy, Ben, and Cara each have a favorite subject: math, history, or art.\nAmy doesn\'t like math or history.\nBen\'s favorite subject isn\'t art.\nWhat is Cara\'s favorite subject?',
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

  // Check if user has already completed assessment
  useEffect(() => {
    const checkExistingAssessment = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Try to get existing profile
        const profile = await getLearningProfile();
        if (profile) {
          // User has already completed assessment, redirect to dashboard
          toast.error('You have already completed the assessment');
          router.push('/dashboard');
        }
      } catch (error) {
        // If we get a 404, it means no profile exists, which is what we want
        // Any other error should redirect to login
        if (error instanceof Error && !error.message.includes('not found')) {
          toast.error('Please log in to take the assessment');
          router.push('/login');
        }
      }
    };

    checkExistingAssessment();
  }, [router]);

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
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to save your assessment');
        router.push('/login');
        return;
      }

      // Calculate verbal score (verbal + logic questions)
      let verbalScore = 0;
      const ageNum = parseInt(age);
      
      // Score for ordering question (verbal1)
      const orderingAnswer = answers['verbal1'] || '';
      const correctOrder = ageNum >= 6 && ageNum <= 12 ? '3,2,5,1,4' : '2,3,5,1,4';
      const userOrderArray = orderingAnswer.split(',');
      const correctOrderArray = correctOrder.split(',');
      
      // Add 0.2 points for each correct position in verbal1
      userOrderArray.forEach((num, index) => {
        if (num === correctOrderArray[index]) {
          verbalScore += 0.2;
        }
      });

      // Score for verbal2
      const verbal2Answer = answers['verbal2'] || '';
      const correctVerbal2Answer = ageNum >= 6 && ageNum <= 12 
        ? 'To guess what will happen next'
        : 'An educated guess';
      
      if (verbal2Answer === correctVerbal2Answer) {
        verbalScore += 1.0;
      }

      // Score for logic1
      const logic1Answer = answers['logic1'] || '';
      const correctLogic1Answer = ageNum >= 6 && ageNum <= 12
        ? 'It was left in the sun'
        : 'Yes';
      
      if (logic1Answer === correctLogic1Answer) {
        verbalScore += 1.0;
      }

      // Score for logic2
      const logic2Answer = answers['logic2'] || '';
      const correctLogic2Answer = ageNum >= 6 && ageNum <= 12
        ? 'Sock'
        : 'History';
      
      if (logic2Answer === correctLogic2Answer) {
        verbalScore += 1.0;
      }

      // Calculate non-verbal score
      let nonVerbalScore = 0;
      
      // Score for nonverbal1
      const nonverbal1Answer = answers['nonverbal1'] || '';
      const correctNonverbal1Answer = ageNum >= 6 && ageNum <= 12
        ? '△'
        : '◻️';
      
      if (nonverbal1Answer === correctNonverbal1Answer) {
        nonVerbalScore += 1.0;
      }

      // Calculate self assessment score (sum of ratings)
      const selfAssessmentScore = ratings.followInstructions + ratings.solvePuzzles;

      const learningProfile = {
        age: ageNum,
        verbal_score: verbalScore,
        non_verbal_score: nonVerbalScore,
        self_assessment: selfAssessmentScore
      };

      // Save to backend
      await createLearningProfile(learningProfile);
      
      toast.success('Assessment completed successfully!');
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to submit assessment. Please try again.');
      }
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

      case 'ordered-number':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">{question.question}</h3>
            <div className="space-y-4">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <select
                    value={answers[question.id]?.split(',')[index] || ''}
                    onChange={(e) => {
                      const currentAnswers = answers[question.id]?.split(',') || new Array(question.options?.length).fill('');
                      currentAnswers[index] = e.target.value;
                      handleAnswerChange(question.id, currentAnswers.join(','));
                    }}
                    className="w-24 p-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-700">{option}</span>
                </div>
              ))}
            </div>
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
        <h1 className="text-3xl font-bold text-purple-600 mb-8">Hi! Let's play some fun games to see how you learn best. There's no right or wrong—just do your best!</h1>
        
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