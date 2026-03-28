'use client'; 
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../Header'; 
import { client } from '@/lib/sanity';

// ==========================================
// 🧠 LES OUTILS DE CORRECTION INTELLIGENTE
// ==========================================

// 1. Nettoyer le texte (enlève majuscules et accents)
const cleanText = (str) => {
  if (!str) return "";
  return str
    .normalize("NFD") 
    .replace(/[\u0300-\u036f]/g, "") 
    .toLowerCase() 
    .trim(); 
};

// 2. Calculer le nombre de fautes (Distance de Levenshtein)
const calculateDistance = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, 
          matrix[i][j - 1] + 1,     
          matrix[i - 1][j] + 1      
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

// ==========================================
// 🎮 LE JEU
// ==========================================

export default function QuizPage() {
  const [questionsQuiz, setQuestionsQuiz] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [gameStarted, setGameStarted] = useState(false); 
  const [pseudo, setPseudo] = useState(""); 
  const [timeLeft, setTimeLeft] = useState(15); 
  const [leaderboard, setLeaderboard] = useState([]); 
  
  const [textAnswer, setTextAnswer] = useState(""); 
  const [feedback, setFeedback] = useState(null); 

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const query = `*[_type == "quizQuestion"]{
          _id, questionText, type, options, correctAnswer, "imageUrl": image.asset->url
        }`;
        const data = await client.fetch(query);
        const shuffled = data.sort(() => 0.5 - Math.random());
        setQuestionsQuiz(shuffled.slice(0, 10)); 
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur :", error);
        setIsLoading(false);
      }
    };
    fetchQuestions();
    
    const savedScores = JSON.parse(localStorage.getItem('docquizz_leaderboard') || '[]');
    setLeaderboard(savedScores);
  }, []);

  useEffect(() => {
    if (!gameStarted || showScore || feedback) return;

    if (timeLeft === 0) {
      handleAnswer(""); 
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameStarted, showScore, feedback]);

  // 🟢 GESTION DE LA RÉPONSE AVEC TOLÉRANCE ET MULTIPLES OPTIONS
  const handleAnswer = (userAnswer) => {
    const question = questionsQuiz[currentQuestion];
    
    let isCorrect = false;

    if (userAnswer && userAnswer.trim()) {
      const cleanUser = cleanText(userAnswer);
      
      // On découpe la réponse de Sanity à chaque virgule pour créer une liste de réponses valides
      const reponsesPossibles = question.correctAnswer.split(',');

      // On vérifie la réponse du joueur contre chaque possibilité de la liste
      for (let i = 0; i < reponsesPossibles.length; i++) {
        const cleanCorrect = cleanText(reponsesPossibles[i]);
        const distance = calculateDistance(cleanUser, cleanCorrect);

        let tolerance = 0;
        if (cleanCorrect.length > 5) {
          tolerance = 2; // Mots longs : 2 fautes max
        } else if (cleanCorrect.length > 2) {
          tolerance = 1; // Mots de 3 à 5 lettres : 1 faute max
        } else {
          tolerance = 0; // Mots de 1 à 2 lettres (ex: "M") : 0 faute, match exact exigé !
        }

        if (distance <= tolerance) {
          isCorrect = true;
          break; // C'est juste ! On arrête de chercher.
        }
      }
    }

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setFeedback("✅ BONNE RÉPONSE");
    } else {
      // S'il a faux, on ne lui montre que la première réponse (avant la première virgule) pour que ça reste propre
      const reponsePrincipale = question.correctAnswer.split(',')[0].trim();
      setFeedback(timeLeft === 0 ? "⏰ TEMPS ÉCOULÉ !" : `❌ FAUX ! C'était : ${reponsePrincipale}`);
    }

    setTimeout(() => {
      setFeedback(null);
      setTextAnswer(""); 
      setTimeLeft(15); 
      
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questionsQuiz.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        endGame(score + (isCorrect ? 1 : 0)); 
      }
    }, 2000);
  };

  const endGame = (finalScore) => {
    setShowScore(true);
    const newEntry = { name: pseudo, score: finalScore };
    const newLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score) 
      .slice(0, 5); 

    setLeaderboard(newLeaderboard);
    localStorage.setItem('docquizz_leaderboard', JSON.stringify(newLeaderboard));
  };

  const restartGame = () => {
    window.location.reload();
  };

  const startGame = () => {
    if (pseudo.trim() !== "") {
      setGameStarted(true);
      setTimeLeft(15);
    } else {
      alert("N'oublie pas d'entrer ton pseudo !");
    }
  };

  if (isLoading) return <><Header /><main className="quiz-main"><div className="quiz-container"><h2>Chargement... ⏳</h2></div></main></>;
  if (questionsQuiz.length === 0) return <><Header /><main className="quiz-main"><div className="quiz-container"><h2>Aucune question trouvée.</h2></div></main></>;

  const question = questionsQuiz[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / questionsQuiz.length) * 100;

  return (
    <> 
      <Header />
      
      <div className="quiz-page-wrapper"> 
        <main className="quiz-main">
          <div className="quiz-container">
            
            {!gameStarted ? (
              <div className="quiz-welcome-section">
                <img src="/images/doc-quizz-nav.png" alt="DOCQUIZZ Logo" className="quiz-welcome-logo" />
                <h1 className="quiz-welcome-title">Bienvenue sur DOCQUIZZ</h1>
                
                <div className="quiz-pseudo-box">
                  <input 
                    type="text" 
                    placeholder="ENTRE TON PSEUDO..." 
                    value={pseudo} 
                    onChange={(e) => setPseudo(e.target.value.toUpperCase())}
                    className="quiz-pseudo-input"
                    maxLength={15}
                    onKeyDown={(e) => e.key === 'Enter' && startGame()}
                  />
                  <button onClick={startGame} className="quiz-btn-start" disabled={!pseudo.trim()}>
                    LANCER LE QUIZZ
                  </button>
                </div>
              </div>

            ) : showScore ? (
              <div className="quiz-score-section">
                <h2>BRAVO {pseudo} !</h2>
                <p>VOICI TON SCORE : {score} / {questionsQuiz.length}</p>
                
                <div className="quiz-leaderboard">
                  <h3>🏆 HIGH SCORES 🏆</h3>
                  <ul>
                    {leaderboard.map((entry, index) => (
                      <li key={index} className={index === 0 ? 'top-1' : ''}>
                        <span className="rank">#{index + 1}</span>
                        <span className="name">{entry.name}</span>
                        <span className="pts">{entry.score} PTS</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="quiz-score-actions">
                  <button onClick={restartGame} className="quiz-btn-restart">REJOUER</button>
                  <Link href="/docutheque" className="quiz-btn-docu">DOCUTHÈQUE</Link>
                </div>
              </div>

            ) : (
              <div className="quiz-question-section">
                
                <div className="quiz-hud">
                  <div className={`quiz-timer ${timeLeft <= 5 ? 'danger' : ''}`}>
                    ⏱ {timeLeft}s
                  </div>
                  <div className="quiz-progress-container">
                    <div className="quiz-progress-bar">
                      <div className="quiz-progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <span className="quiz-progress-text">{currentQuestion + 1} / {questionsQuiz.length}</span>
                  </div>
                </div>
                
                {feedback ? (
                  <div className="quiz-feedback-msg">{feedback}</div>
                ) : (
                  <>
                    <h2 className="quiz-question-text">{question.questionText}</h2>

                    {question.imageUrl && (
                      <img src={question.imageUrl} alt="Indice" className="quiz-image" />
                    )}

                    {question.type === 'qcm' ? (
                      <div className="quiz-options">
                        {question.options?.map((option, index) => (
                          <button key={index} onClick={() => handleAnswer(option)} className="quiz-btn-option">
                            {option}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="quiz-text-input-container">
                        <input
                          type="text"
                          value={textAnswer}
                          onChange={(e) => setTextAnswer(e.target.value)}
                          placeholder="Ta réponse..."
                          className="quiz-input-text"
                          onKeyDown={(e) => e.key === 'Enter' && handleAnswer(textAnswer)}
                        />
                        <button onClick={() => handleAnswer(textAnswer)} className="quiz-btn-submit">
                          VALIDER
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </> 
  );
}