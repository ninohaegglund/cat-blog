import { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import confetti from 'canvas-confetti'; //konfetti effetk
import sound from "./assets/audio/Frédéric Chopin - Waltz no. 19 op. posth. in A Minor.mp3";


function App() {
  // Definierar state-variabler.för att spara quizens tillstånd
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [stage, setStage] = useState('welcome');
  const [countdown, setCountdown] = useState(3);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizError, setQuizError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizTimer, setQuizTimer] = useState(10);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    const audioInstance = new Audio(sound);
    audioInstance.volume = 0.2;
    setAudio(audioInstance);

    return () => {
      audioInstance.pause();
      audioInstance.src = '';
    };
  }, []);

  //Funktion för att spela musik
  const play = () => {
    if (audio) audio.play();
  };

  const pause = () => {
    if (audio) audio.pause();
  };

 // Hämtar frågor från questions.json
  useEffect(() => {
    fetch('/questions.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load questions');
        }
        return response.json();
      })
      .then((data) => {
        setQuestions(data); // Sparar frågorna i state.
        setLoading(false);
      })
      .catch((error) => {
        setQuizError(error.message);
        setLoading(false);
      });
  }, []);

  // Timer för nedräkning innan quizzet börjar.
  useEffect(() => {
    if (stage === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (stage === 'countdown' && countdown === 0) {
      setStage('quiz');
    }
  }, [stage, countdown]);

  // Timer för varje fråga i quizzet.
  useEffect(() => {
    if (stage === 'quiz' && quizTimer > 0) {
      const timer = setTimeout(() => setQuizTimer(quizTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (stage === 'quiz' && quizTimer === 0) {
      handleNextQuestion();
    }
  }, [stage, quizTimer]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (e.target.value) {
      setError('');
    }
  };

  //startar quiz spelet
  const handleStart = () => {
    if (!name.trim()) {
      setError('Please enter your name');
    } else {
      setStage('countdown');
      confetti({
        spread: 275,
        particleCount: 433,
        origin: { y: 0.6 },
        startVelocity: 70,
      });
    }
  };

  // Hanterar användarens svar.
  const handleAnswerClick = (index) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(index);
      setShowFeedback(true);

      if (index === questions[currentQuestionIndex].correct) {
        setScore(score + 1); // Uppdaterar poäng vid korrekt svar.
      }
    }
  };

  // Går till nästa fråga.
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setQuizTimer(10);
    } else {
      setStage('results'); // Går vidare till resultaten.
      confetti({
        spread: 375,
        particleCount: 432,
        origin: { x: 0 },
        startVelocity: 70,
      });
      confetti({
        spread: 375,
        particleCount: 433,
        origin: { x: 1 },
        startVelocity: 70,
      });  
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading questions...</div>;
  }

  if (quizError) {
    return <div className="text-center text-xl">Error: {quizError}</div>;
  }

  const progressValue = (currentQuestionIndex / (questions.length - 1)) * 100;  // Beräknar framsteg på progressbar efter varje fråga



  return (
    
    //Tailwind/DaisyUI styling
    <div className="App min-h-screen flex flex-col items-center justify-center">
      
      <div className="dropdown fixed top-4 right-4 mr-4 mt-4">
      <div tabIndex={0} role="button" className="btn m-1">
        Theme
        <svg
          width="12px"
          height="12px"
          className="inline-block h-2 w-2 fill-current opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048">
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>
      <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl">
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Default"
            value="default" />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Retro"
            value="retro" />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Cyberpunk"
            value="cyberpunk" />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Valentine"
            value="valentine" />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Aqua"
            value="aqua" />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Synthwave"
            value="synthwave" />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Dark"
            value="dark" />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Black"
            value="black" />
        </li>
      </ul>
      </div>

      <label className="swap absolute bottom-4 left-4">
       
          <input type="checkbox" />
          <svg
            className="swap-on fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            onClick={play}>
            <path
              d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
          </svg>

          <svg
            className="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            onClick={pause}>
            <path
              d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z" />
          </svg>
        </label>

      {stage === 'welcome' && (
         // Välkomstskärmen visas om stage är "welcome"
         <div className="welcome text-center p-8 rounded-2xl shadow-2xl bg-base-100/90 backdrop-blur-sm w-96 transform transition-all hover:scale-105"> 
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to my Quiz Game 💥
          </h1>
          <input
            placeholder="Enter your name"
            value={name}
            onChange={handleNameChange}
            className="input input-bordered input-accent w-full max-w-xs mb-4"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            onClick={handleStart}
            className="btn btn-accent transition-all hover:gap-3 hover:scale-[1.02]"
          >
            Start Quiz
          </button>
        </div>     
      )}

      {stage === 'countdown' && (
        // Nedräkningen visas om stage är "countdown"
        <div className="text-center p-8 rounded-2xl shadow-2xl bg-base-100/90 backdrop-blur-sm w-96 animate-fade-in">
          <span className="loading loading-infinity loading-lg"></span>
          <h3 className="text-xl font-semibold mb-6">Welcome, {name}!</h3>
          <h2 className="text-xl font-semibold mb-6">Get Ready! The quiz starts in...</h2>
          <div className="countdown text-6xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {countdown}
          </div>
        </div>
      )}


      {stage === 'quiz' && (
         // Quiz-skärmen visas om stage är "quiz"
         <div className="quiz p-8 rounded-2xl shadow-2xl bg-base-100/90 backdrop-blur-sm w-full max-w-lg transform transition-all">
          {/* progressbar för quizet */}
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Progress</span>
              <span>{Math.round(progressValue)}%</span>
            </div>
            <progress 
              className="progress progress-primary h-3 transition-all duration-300" 
              value={progressValue} 
              max="100"
            ></progress>
          </div>
           {/* Nuvarande fråga */}
          <h2 className="text-xl font-semibold mb-4">
            Question {currentQuestionIndex + 1}/{questions.length}
          </h2>
          <div className="card mb-4">
            <h3 className="text-lg font-bold">{questions[currentQuestionIndex].question}</h3>
            {/* Alternativen för frågan */}
              <ul className="options space-y-3">
                {questions[currentQuestionIndex].options.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  className={`option-item btn btn-block btn-lg justify-start h-auto min-h-12 py-3 transition-all duration-200 ${
                    selectedAnswer === null 
                      ? 'hover:bg-primary/20 hover:translate-x-2 hover:shadow-md bg-base-200'
                      : index === questions[currentQuestionIndex].correct
                        ? 'bg-green-100 text-green-800 border-2 border-green-300'
                        : selectedAnswer === index
                          ? 'bg-red-100 text-red-800 border-2 border-red-300'
                          : 'bg-base-200 opacity-75'
                  }`}
                  style={{ pointerEvents: selectedAnswer === null ? 'auto' : 'none' }}
                >
                  <span className="text-lg">{option}</span>
                  {selectedAnswer !== null && index === questions[currentQuestionIndex].correct && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </li>
              ))}
            </ul>
          </div >
           {/* Feedback om svaret är rätt eller fel */}
          {showFeedback && selectedAnswer !== null && (
            <p className="mt-2 mb-4 ml-2 text-xl text-center ">
              {selectedAnswer === questions[currentQuestionIndex].correct
                ? 'Correct! 🎉'
                : 'Incorrect! 😞'}
            </p>
          )}
          {/*knapp (next question) för att gå till nästa fråga, visas endast om ett svar är valt */}
          {selectedAnswer !== null && (
            <button 
              onClick={handleNextQuestion}
             className="btn btn-primary mx-auto block "
            >
              Next Question
            </button>
          )}
          <p className="mt-4 text-lg text-center">Time remaining: {quizTimer} seconds</p>
        </div>
      )}

{stage === 'results' && (
        <div className="results text-center p-8 rounded-2xl shadow-2xl bg-base-100/90 backdrop-blur-sm w-96 animate-fade-in">
          <div className="mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-xl mb-4">
              Well done, <span className="font-semibold text-primary">{name}</span>!
            </p>
            <div className="stats shadow-lg">
              <div className="stat">
                <div className="stat-title">Your Score</div>
                <div className="stat-value text-primary">{score}/{questions.length}</div>
                <div className="stat-desc">{((score/questions.length)*100).toFixed(1)}% Correct</div>
              </div>
            </div>
          </div>
            <button
            onClick={() => window.location.reload()}
            className="btn btn-primary w-full mt-4 py-2 font-semibold rounded hover:gap-3 hover:scale-[1.02]"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
