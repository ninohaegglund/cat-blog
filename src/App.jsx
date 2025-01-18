import { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import confetti from 'canvas-confetti';

function App() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [stage, setStage] = useState('welcome');
  const [countdown, setCountdown] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizError, setQuizError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizTimer, setQuizTimer] = useState(10);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    fetch('/questions.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load questions');
        }
        return response.json();
      })
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((error) => {
        setQuizError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (stage === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (stage === 'countdown' && countdown === 0) {
      setStage('quiz');
    }
  }, [stage, countdown]);

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

  const handleStart = () => {
    if (!name.trim()) {
      setError('Please enter your name');
    } else {
      setStage('countdown');
      confetti({
        spread: 275,
        particleCount: 233,
        origin: { y: 0.6 },
        startVelocity: 70,
      });
    }
  };

  const handleAnswerClick = (index) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(index);
      setShowFeedback(true);

      if (index === questions[currentQuestionIndex].correct) {
        setScore(score + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setQuizTimer(10);
    } else {
      setStage('results'); 
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading questions...</div>;
  }

  if (quizError) {
    return <div className="text-center text-xl">Error: {quizError}</div>;
  }

  const progressValue = (currentQuestionIndex / (questions.length - 1)) * 100;

  return (
    

    <div className="App bg-gray-50 min-h-screen flex flex-col items-center justify-center">
  

      {stage === 'welcome' && (
        <div className="welcome text-center p-6 bg-white rounded-lg shadow-md w-96">

         
          <h1 className="text-3xl font-bold mb-4">Welcome to my Amazing Quiz Game💥</h1>
          <input
            placeholder="Enter your name"
            value={name}
            onChange={handleNameChange}
            className="input input-bordered input-warning w-full max-w-xs mb-3 bg-white"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            onClick={handleStart}
            className="btn btn-outline btn-accent"
          >
            Start Quiz
          </button>

        </div>
        
      )}

      {stage === 'countdown' && (
        <div className="text-center p-6 bg-white rounded-lg shadow-md w-96">
          <span className="loading loading-infinity loading-lg"></span>
          <h3 className="text-xl font-semibold mb-6">Welcome, {name}!</h3>
          <h2 className="text-xl font-semibold mb-6">Get Ready! The quiz starts in...</h2>
          <h1 className="text-5xl font-bold text-blue-500">{countdown}</h1>
        </div>

        
      )}


      {stage === 'quiz' && (
        <div className="quiz p-6 bg-white rounded-lg shadow-md w-96 ">
          <progress className="progress progress-primary  w-56" value={progressValue} max="100"></progress>
          <h2 className="text-xl font-semibold mb-4">
            Question {currentQuestionIndex + 1}/{questions.length}
          </h2>
          <div className="card mb-4">
            <h3 className="text-lg font-bold">{questions[currentQuestionIndex].question}</h3>
            <ul className="options mt-4 space-y-2">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  className={`${
                    selectedAnswer === index
                      ? index === questions[currentQuestionIndex].correct
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'cursor-pointer hover:bg-gray-200'
                  } p-2 rounded-md`}
                  style={{
                    pointerEvents: selectedAnswer === null ? 'auto' : 'none',
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div >
          {showFeedback && selectedAnswer !== null && (
            <p className="mt-2 mb-4 ml-2 text-xl text-center ">
              {selectedAnswer === questions[currentQuestionIndex].correct
                ? 'Correct! 🎉'
                : 'Incorrect! 😞'}
            </p>
          )}
          {selectedAnswer !== null && (
            <button
              onClick={handleNextQuestion}
             className="btn btn-warning mx-auto block"
            >
              Next Question
            </button>
          )}
          <p className="mt-4 text-lg text-center">Time remaining: {quizTimer} seconds</p>
        </div>
      )}

      {stage === 'results' && (
        <div className="results text-center p-6 bg-white rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-4">Quiz Finished!</h2>
          <p className="text-xl">
            Well done, {name}! Your score is {score}/{questions.length}.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary w-full mt-4 py-2 text-white font-semibold rounded"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
