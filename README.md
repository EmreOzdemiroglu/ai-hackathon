# Verb.AI
**Verb.AI** is a personalized learning platform designed to help individuals with **verbal strengths and non-verbal deficits** leverage their cognitive profiles for effective learning. By scaffolding spatial and non-verbal tasks through verbal strategies, Verb.AI provides a tailored educational experience that adapts to each user's unique needs.
---
## Features
- **Personalized Learning Profiles**: Assess users' verbal and non-verbal strengths to create adaptive learning paths.
- **AI-Powered Chatbot**: A Gemini 2.0 Flash-powered chatbot that provides personalized feedback and guidance.
- **Pomodoro Timer**: Track focused learning sessions with a built-in Pomodoro timer.
- **Time-Spent Analytics**: Visualize daily and weekly learning progress with interactive bar charts.
- **Adaptive Tasks**: Scaffold non-verbal tasks using verbal strategies based on user profiles.
—
## Tech Stack
### Front-End
- **Typescript**
- **React**
- **Next.js**
- **Tailwind CSS**
### Back-End
- **Python**
- **FastAPI**
- **SQLite3**
- **Gemini 2.0 Flash** (for AI agents)
### DevOps
- **Cloudflare Tunnel** (for hosting)
- **Cloudflare Server**
---
## Getting Started
### Prerequisites
- Python 3.9+
- Node.js 16+
- npm 8+

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/verb-ai.git
   cd verb-ai
   ```
2. **Set Up Backend**:
   - Navigate to the backend folder:
     ```bash
     cd backend
     ```
   - Install Python dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Run the FastAPI server:
     ```bash
     uvicorn main:app --reload
     ```
   - The backend will be available at `http://localhost:8000`.
3. **Set Up Frontend**:
   - Navigate to the frontend folder:
     ```bash
     cd ../frontend
     ```
   - Install npm dependencies:
     ```bash
     npm install
     ```
   - Run the Next.js development server:
     ```bash
     npm run dev
     ```
   - The frontend will be available at `http://localhost:3000`.
4. **Configure Environment Variables**:
   - Create a `.env` file in the `backend` folder:
     ```env
     DATABASE_URL=sqlite:///./instance/database.db
     GEMINI_API_KEY=your_gemini_api_key
     ```
   - Create a `.env.local` file in the `frontend` folder:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:8000
     ```

## Future Works

Verb.AI is an evolving platform, and we have exciting plans to enhance its capabilities to better serve users with verbal strengths and non-verbal deficits. Here’s what’s next:

### 1. **Enhanced Visual and Animated Assistance**
   - **Animated Scaffolding**: Introduce animations and visual aids to help users with non-verbal deficits better understand spatial and abstract concepts. For example:
     - Animations for math problems (e.g., visualizing fractions or geometry).
     - Interactive diagrams for science concepts (e.g., the water cycle or planetary motion).
   - **Visual Storytelling**: Use comic-style visuals and storyboards to explain complex ideas in a step-by-step manner.

### 2. **Interactive Games**
   - **Gamified Learning**: Develop interactive games that adapt to the user’s learning profile. For example:
     - Puzzle games for spatial reasoning.
     - Word-based games for verbal reinforcement.
   - **Progress Tracking**: Integrate game-based achievements to motivate users and track their progress.

### 3. **Story/Linking Method**
   - **Narrative-Based Learning**: Use stories to link concepts together, helping users build a deeper understanding. For example:
     - A story about a character solving a mystery using math or logic.
     - Historical narratives to teach cause-and-effect relationships.
   - **Concept Mapping**: Visualize how different ideas are connected through interactive mind maps.

### 4. **Enhanced Personalized Chat **
   - **Fine-Tuned Models**: Deploy LLaMA (or similar open-source LLMs) for more personalized and context-aware conversations. This will allow the chatbot to:
     - Adapt to individual learning styles.
     - Provide more nuanced feedback and guidance.
   - **Emotion-Aware Responses**: Incorporate sentiment analysis to respond empathetically to user frustration or confusion.

### 5. **Learning Through Speaking**
   - **Verbal Explanation Tasks**: Encourage users to explain concepts verbally, helping them strengthen their verbal reasoning skills. For example:
     - The chatbot asks, “Can you explain how you solved this problem?”
     - The model provides prompts to guide the user to the next logical step.
   - **Language-to-Reality Mapping**: Leverage the idea that if LLMs can understand physical reality through language, non-verbal learners can too. Use language as a bridge to scaffold spatial and abstract thinking.

### 6. **Collaborative Learning Features**
   - **Group Activities**: Introduce collaborative tasks where users can work together to solve problems, fostering peer learning.
   - **Parent/Teacher Dashboard**: Provide insights and recommendations for caregivers to support the user’s learning journey.

### 7. **Accessibility Enhancements**
   - **Voice Commands**: Allow users to interact with the platform using voice commands.
   - **Text-to-Speech and Speech-to-Text**: Improve accessibility for users with reading or writing difficulties.

### 8. **Advanced Analytics**
   - **Learning Progress Reports**: Generate detailed reports on user progress, highlighting strengths and areas for improvement.
   - **Adaptive Difficulty**: Dynamically adjust task difficulty based on real-time performance data.

---

## Why These Features?
Our goal is to create a platform that not only addresses the current needs of users with verbal strengths and non-verbal deficits but also empowers them to thrive in all areas of learning. By combining **visual scaffolding**, **interactive games**, **story-based learning**, and **personalized AI interactions**, we aim to make learning engaging, accessible, and effective for every user.

---
