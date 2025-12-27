/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, GraduationCap, Star, CheckCircle2, XCircle, RefreshCw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const DAILY_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "If you have 3 apples and your friend gives you 5 more, how many apples do you have in total?",
    options: ["6", "7", "8", "9"],
    correctAnswer: "8",
    explanation: "Great job! 3 + 5 = 8. You're a math star! 🍎"
  },
  {
    id: 2,
    text: "Which of these animals is known for being very slow?",
    options: ["Cheetah", "Sloth", "Eagle", "Rabbit"],
    correctAnswer: "Sloth",
    explanation: "Correct! Sloths move very slowly through the trees. 🦥"
  },
  {
    id: 3,
    text: "What color do you get when you mix Red and Blue?",
    options: ["Green", "Orange", "Purple", "Pink"],
    correctAnswer: "Purple",
    explanation: "Awesome! Red and Blue make Purple. You're an artist! 🎨"
  }
];

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(DAILY_QUESTIONS[0]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    // Pick a random question on mount
    const randomIndex = Math.floor(Math.random() * DAILY_QUESTIONS.length);
    setCurrentQuestion(DAILY_QUESTIONS[randomIndex]);
  }, []);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Prevent multiple clicks

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowExplanation(true);

    if (correct) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF69B4', '#00CED1', '#ADFF2F']
      });
    }
  };

  const resetQuestion = () => {
    const nextIndex = (DAILY_QUESTIONS.indexOf(currentQuestion) + 1) % DAILY_QUESTIONS.length;
    setCurrentQuestion(DAILY_QUESTIONS[nextIndex]);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  return (
    <div className="min-h-screen bg-amber-50 font-sans text-slate-800 pb-12">
      {/* Colorful Header */}
      <header className="bg-gradient-to-r from-pink-400 via-yellow-400 to-cyan-400 p-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="bg-white p-2 rounded-2xl shadow-md">
              <GraduationCap className="w-8 h-8 text-pink-500" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-sm">
              KidTutor
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="flex items-center gap-2 bg-white/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/40"
          >
            <Star className="w-5 h-5 text-yellow-200 fill-yellow-200" />
            <span className="font-bold text-white">1,250 Points</span>
          </motion.div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        {/* Welcome Area */}
        <motion.section 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 shadow-xl border-4 border-pink-100 flex flex-col md:flex-row items-center gap-8"
        >
          <div className="relative">
            <div className="w-32 h-32 bg-cyan-100 rounded-full flex items-center justify-center border-4 border-cyan-200 overflow-hidden">
              <img 
                src="https://picsum.photos/seed/kid/200/200" 
                alt="Student Avatar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-full shadow-lg"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
          </div>
          
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-4xl font-black text-slate-800">
              Welcome back, <span className="text-pink-500">Super Student!</span> 🚀
            </h2>
            <p className="text-xl text-slate-500 font-medium">
              Ready to learn something amazing today? You're doing a fantastic job!
            </p>
          </div>
        </motion.section>

        {/* Question of the Day Box */}
        <motion.section 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-cyan-100"
        >
          <div className="bg-cyan-500 p-6 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-white" />
            <h3 className="text-2xl font-black text-white">Question of the Day</h3>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
              <p className="text-2xl font-bold text-slate-700 leading-relaxed">
                {currentQuestion.text}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={`
                    p-6 rounded-2xl text-xl font-black transition-all border-b-4
                    ${selectedAnswer === option 
                      ? (isCorrect ? 'bg-green-500 text-white border-green-700' : 'bg-red-500 text-white border-red-700')
                      : 'bg-white text-slate-700 border-slate-200 hover:border-cyan-400 hover:bg-cyan-50'
                    }
                    ${selectedAnswer !== null && option === currentQuestion.correctAnswer && !isCorrect ? 'bg-green-100 border-green-300 text-green-700' : ''}
                    disabled:cursor-default
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {selectedAnswer === option && (
                      isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className={`p-6 rounded-2xl flex items-start gap-4 ${isCorrect ? 'bg-green-50 border-2 border-green-100' : 'bg-red-50 border-2 border-red-100'}`}>
                    <div className={`p-2 rounded-xl ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                      {isCorrect ? <CheckCircle2 className="w-6 h-6 text-white" /> : <XCircle className="w-6 h-6 text-white" />}
                    </div>
                    <div className="space-y-2">
                      <p className={`text-xl font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                        {isCorrect ? 'You got it!' : 'Not quite right!'}
                      </p>
                      <p className="text-lg text-slate-600 font-medium">
                        {currentQuestion.explanation}
                      </p>
                      <button 
                        onClick={resetQuestion}
                        className="mt-4 flex items-center gap-2 bg-white px-4 py-2 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Try Another Question
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Learning Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Read Daily', icon: '📚', color: 'bg-pink-100 text-pink-600' },
            { title: 'Ask Questions', icon: '❓', color: 'bg-yellow-100 text-yellow-600' },
            { title: 'Stay Curious', icon: '💡', color: 'bg-cyan-100 text-cyan-600' }
          ].map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + (i * 0.1) }}
              className={`p-6 rounded-3xl ${tip.color} flex flex-col items-center text-center gap-2 shadow-sm border-2 border-white`}
            >
              <span className="text-4xl">{tip.icon}</span>
              <span className="font-black text-lg">{tip.title}</span>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="mt-12 text-center text-slate-400 font-medium">
        <p>© 2025 KidTutor • Making Learning Fun! ✨</p>
      </footer>
    </div>
  );
}

