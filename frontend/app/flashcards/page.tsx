import FlashcardPage from "../components/flashcard-page"

export default function FlashcardsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 p-4">
      <div className="relative w-full max-w-2xl">
        <div className="absolute -top-16 -left-16 h-32 w-32 rounded-full bg-yellow-200 opacity-50"></div>
        <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-green-200 opacity-50"></div>
        <FlashcardPage />
      </div>
    </main>
  )
} 