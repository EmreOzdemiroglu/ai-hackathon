export interface Course {
  id: string;
  name: string;
  flashcards: Array<{
    front: string;
    back: string;
  }>;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  courses: Course[];
}

export const MAX_FLASHCARDS = 15;

export const subjects: Subject[] = [
  {
    id: "math",
    name: "Mathematics",
    icon: "➗",
    courses: [
      {
        id: "basic-arithmetic",
        name: "Basic Arithmetic",
        flashcards: [
          { front: "What is 2 + 2?", back: "4" },
          { front: "What is 5 × 3?", back: "15" },
          { front: "What is 10 ÷ 2?", back: "5" },
          { front: "What is 7 + 3?", back: "10" },
          { front: "What is 4 × 4?", back: "16" },
          { front: "What is 20 ÷ 4?", back: "5" },
          { front: "What is 9 + 6?", back: "15" },
          { front: "What is 8 × 2?", back: "16" },
          { front: "What is 15 ÷ 3?", back: "5" },
          { front: "What is 12 + 8?", back: "20" }
        ]
      },
      {
        id: "fractions",
        name: "Fractions",
        flashcards: [
          { front: "What is 1/2 + 1/2?", back: "1" },
          { front: "What is 1/4 of 12?", back: "3" },
          { front: "What is 2/3 + 1/3?", back: "1" },
          { front: "What is 1/2 of 10?", back: "5" },
          { front: "What is 3/4 + 1/4?", back: "1" },
          { front: "What is 1/3 of 15?", back: "5" },
          { front: "What is 2/5 + 3/5?", back: "1" },
          { front: "What is 1/8 of 24?", back: "3" }
        ]
      }
    ]
  },
  {
    id: "science",
    name: "Science",
    icon: "🔬",
    courses: [
      {
        id: "basic-biology",
        name: "Basic Biology",
        flashcards: [
          { front: "What is photosynthesis?", back: "The process by which plants make their food using sunlight" },
          { front: "What is the basic unit of life?", back: "Cell" },
          { front: "What do plants need for photosynthesis?", back: "Sunlight, water, and carbon dioxide" },
          { front: "What is the function of the heart?", back: "To pump blood throughout the body" },
          { front: "What are the building blocks of proteins?", back: "Amino acids" },
          { front: "What is the largest organ in the human body?", back: "Skin" },
          { front: "What do plants release during photosynthesis?", back: "Oxygen" },
          { front: "What is the function of red blood cells?", back: "To carry oxygen" }
        ]
      },
      {
        id: "solar-system",
        name: "Solar System",
        flashcards: [
          { front: "What is the closest planet to the Sun?", back: "Mercury" },
          { front: "How many planets are in our solar system?", back: "8" },
          { front: "What is the largest planet?", back: "Jupiter" },
          { front: "What is Earth's natural satellite?", back: "The Moon" },
          { front: "Which planet is known as the Red Planet?", back: "Mars" },
          { front: "What is the Sun?", back: "A star at the center of our solar system" },
          { front: "What are the rings of Saturn made of?", back: "Ice, rock, and dust particles" },
          { front: "Which planet is known as the Ice Giant?", back: "Uranus" }
        ]
      }
    ]
  },
  {
    id: "english",
    name: "English",
    icon: "📚",
    courses: [
      {
        id: "grammar",
        name: "Grammar",
        flashcards: [
          { front: "What is a noun?", back: "A person, place, thing, or idea" },
          { front: "What is a verb?", back: "An action word or state of being" },
          { front: "What is an adjective?", back: "A word that describes a noun" },
          { front: "What is an adverb?", back: "A word that describes a verb, adjective, or other adverb" },
          { front: "What is a pronoun?", back: "A word that replaces a noun" },
          { front: "What is a preposition?", back: "A word that shows relationship between words" },
          { front: "What is a conjunction?", back: "A word that connects words or phrases" },
          { front: "What is a sentence?", back: "A group of words that expresses a complete thought" }
        ]
      },
      {
        id: "vocabulary",
        name: "Vocabulary",
        flashcards: [
          { front: "What does 'enormous' mean?", back: "Very large in size" },
          { front: "What is the opposite of 'happy'?", back: "Sad" },
          { front: "What does 'brave' mean?", back: "Showing courage" },
          { front: "What is the opposite of 'cold'?", back: "Hot" },
          { front: "What does 'ancient' mean?", back: "Very old" },
          { front: "What is the opposite of 'dark'?", back: "Light" },
          { front: "What does 'magnificent' mean?", back: "Extremely beautiful or impressive" },
          { front: "What is the opposite of 'loud'?", back: "Quiet" }
        ]
      }
    ]
  }
]; 