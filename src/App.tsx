/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, GraduationCap, Star, CheckCircle2, XCircle, 
  RefreshCw, Trophy, Calculator, BookOpen, Globe, 
  Flame, ChevronLeft, Volume2, Lightbulb, Award 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
  q: string;
  options: string[];
  a: string;
  help?: string;
}

interface Chapter {
  id: string;
  title: string;
  icon: string;
  color: string;
  learn: {
    concept: string;
    visual: string;
    voiceText: string;
  };
  practice: Question[];
  test: Question[];
}

const MATH_CURRICULUM: Chapter[] = [
  {
    id: 'counting',
    title: 'Counting to 20',
    icon: '🔢',
    color: 'bg-pink-500',
    learn: {
      concept: 'Counting is finding out how many things are in a group! We start at 1 and go up one by one.',
      visual: '🍎 🍎 🍎 🍎 🍎 \n 1, 2, 3, 4, 5!',
      voiceText: "Hi Jitya! Let's learn to count. Counting is like climbing a ladder. We start at one, then two, then three! Can you count your favorite toys with me?"
    },
    practice: [
      { q: 'What number comes right after 12?', options: ['11', '13', '14', '10'], a: '13', help: 'Start at 10 and count up: 10, 11, 12... the next number is 13!' },
      { q: 'How many stars are here? ⭐⭐⭐', options: ['2', '4', '3', '5'], a: '3', help: 'Point to each star and say the numbers: one, two, three!' }
    ],
    test: [
      { q: 'What is 10 + 5?', options: ['12', '15', '18', '20'], a: '15' },
      { q: 'Which number is smaller than 8?', options: ['10', '12', '5', '9'], a: '5' },
      { q: 'Count the dots: ●●●●', options: ['3', '4', '5', '6'], a: '4' },
      { q: 'What comes before 20?', options: ['18', '21', '19', '17'], a: '19' },
      { q: 'Which is the biggest number?', options: ['15', '19', '11', '14'], a: '19' }
    ]
  },
  {
    id: 'addition',
    title: 'Addition Adventures',
    icon: '➕',
    color: 'bg-cyan-500',
    learn: {
      concept: 'Addition is putting groups together to make a bigger group! We use the plus sign (+).',
      visual: '2 🍎 + 1 🍎 = 3 🍎',
      voiceText: "Hi Jitya! Addition is like a party where everyone joins in. If you have two cookies and I give you one more, you have three cookies in total! Yum!"
    },
    practice: [
      { q: 'What is 2 + 2?', options: ['3', '4', '5', '6'], a: '4', help: 'Hold up 2 fingers on one hand and 2 on the other. Count them all together: 1, 2, 3, 4!' },
      { q: 'If you have 5 and add 0, what do you get?', options: ['0', '6', '5', '10'], a: '5', help: 'Adding zero means adding nothing! So the number stays the same.' }
    ],
    test: [
      { q: '3 + 2 = ?', options: ['4', '5', '6', '7'], a: '5' },
      { q: '1 + 1 = ?', options: ['1', '2', '3', '0'], a: '2' },
      { q: '4 + 0 = ?', options: ['0', '4', '8', '40'], a: '4' },
      { q: '5 + 5 = ?', options: ['10', '11', '9', '15'], a: '10' },
      { q: '2 + 7 = ?', options: ['8', '9', '10', '7'], a: '9' }
    ]
  },
  {
    id: 'shapes',
    title: 'Shapes All Around',
    icon: '📐',
    color: 'bg-yellow-500',
    learn: {
      concept: 'Shapes are the outlines of things! Circles are round, and squares have four straight sides.',
      visual: '🔴 Circle \n 🟦 Square \n 🔺 Triangle',
      voiceText: "Hi Jitya! Look around your room. Is your clock a circle? Is your book a rectangle? Shapes are everywhere if you look closely!"
    },
    practice: [
      { q: 'Which shape has 3 sides?', options: ['Square', 'Circle', 'Triangle', 'Star'], a: 'Triangle', help: 'A triangle looks like a slice of pizza or a party hat. It has three pointy corners!' },
      { q: 'Is a ball a circle or a square?', options: ['Circle', 'Square', 'Triangle', 'Oval'], a: 'Circle', help: 'Balls are round and can roll. That makes them circles!' }
    ],
    test: [
      { q: 'How many sides does a square have?', options: ['3', '4', '5', '0'], a: '4' },
      { q: 'Which shape is round?', options: ['Square', 'Triangle', 'Circle', 'Rectangle'], a: 'Circle' },
      { q: 'A roof of a house is often a...', options: ['Circle', 'Square', 'Triangle', 'Star'], a: 'Triangle' },
      { q: 'A window is usually a...', options: ['Circle', 'Square', 'Triangle', 'Oval'], a: 'Square' },
      { q: 'Which shape has NO corners?', options: ['Square', 'Triangle', 'Circle', 'Rectangle'], a: 'Circle' }
    ]
  }
];

type View = 'home' | 'modules' | 'learn' | 'practice' | 'test' | 'results';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.2;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleAnswer = (answer: string, isTest = false) => {
    if (selectedAnswer || !selectedChapter) return;
    setSelectedAnswer(answer);
    const questions = isTest ? selectedChapter.test : selectedChapter.practice;
    const correct = answer === questions[currentQuestionIndex].a;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const nextQuestion = (isTest = false) => {
    if (!selectedChapter) return;
    const questions = isTest ? selectedChapter.test : selectedChapter.practice;
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else if (isTest) {
      setView('results');
      if ((score / questions.length) >= 0.8) {
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
      }
    } else {
      setView('modules');
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 font-sans text-slate-800 pb-12">
      <header className="bg-gradient-to-r from-pink-400 via-yellow-400 to-cyan-400 p-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            onClick={() => setView('home')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="bg-white p-2 rounded-2xl shadow-md">
              <GraduationCap className="w-8 h-8 text-pink-500" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-sm">KidTutor</h1>
          </motion.div>
          <div className="flex items-center gap-2 bg-white/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/40">
            <Star className="w-5 h-5 text-yellow-200 fill-yellow-200" />
            <span className="font-bold text-white">Math Whiz</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <section className="bg-white rounded-3xl p-8 shadow-xl border-4 border-pink-100 flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 bg-cyan-100 rounded-full flex items-center justify-center border-4 border-cyan-200 overflow-hidden shrink-0">
                  <img src="https://picsum.photos/seed/kid/200/200" alt="Jitya" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-800">Hi <span className="text-pink-500">Jitya!</span></h2>
                  <p className="text-xl text-slate-500 font-medium">Ready for your Math Adventure today? Pick a chapter to start!</p>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MATH_CURRICULUM.map(chapter => (
                  <motion.button
                    key={chapter.id}
                    whileHover={{ y: -8 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedChapter(chapter);
                      setView('modules');
                    }}
                    className="bg-white p-8 rounded-3xl shadow-lg border-b-8 border-slate-200 hover:border-cyan-400 text-center space-y-4"
                  >
                    <div className="text-6xl">{chapter.icon}</div>
                    <h3 className="text-2xl font-black text-slate-700">{chapter.title}</h3>
                    <div className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-500 font-bold text-sm">Grade 1</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'modules' && selectedChapter && (
            <motion.div 
              key="modules"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-pink-500 transition-colors">
                <ChevronLeft className="w-5 h-5" /> Back to Index
              </button>
              <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-cyan-100 text-center space-y-4">
                <div className="text-6xl">{selectedChapter.icon}</div>
                <h2 className="text-4xl font-black text-slate-800">{selectedChapter.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'learn', title: '1. Learn', sub: 'Watch and Listen', icon: <BookOpen />, color: 'border-pink-200 hover:border-pink-400', text: 'text-pink-600' },
                  { id: 'practice', title: '2. Practice', sub: 'Fun Worksheets', icon: <Calculator />, color: 'border-yellow-200 hover:border-yellow-400', text: 'text-yellow-600' },
                  { id: 'test', title: '3. Test', sub: 'Final Challenge', icon: <Award />, color: 'border-cyan-200 hover:border-cyan-400', text: 'text-cyan-600' }
                ].map(mod => (
                  <motion.button
                    key={mod.id}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setView(mod.id as View);
                      setCurrentQuestionIndex(0);
                      setScore(0);
                      setSelectedAnswer(null);
                      setIsCorrect(null);
                    }}
                    className={`bg-white p-8 rounded-3xl shadow-lg border-b-8 ${mod.color} text-center space-y-2`}
                  >
                    <div className="text-4xl flex justify-center text-slate-400">{mod.icon}</div>
                    <h3 className={`text-xl font-black ${mod.text}`}>{mod.title}</h3>
                    <p className="text-slate-500 font-medium">{mod.sub}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'learn' && selectedChapter && (
            <motion.div 
              key="learn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <button onClick={() => setView('modules')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-pink-500 transition-colors">
                <ChevronLeft className="w-5 h-5" /> Back to Chapter
              </button>
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-pink-100">
                <div className="bg-pink-500 p-6 flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white">Learning Time!</h3>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => speak(selectedChapter.learn.voiceText)}
                    className="bg-white text-pink-500 px-4 py-2 rounded-full font-black flex items-center gap-2"
                  >
                    <Volume2 className="w-5 h-5" /> Play Voice
                  </motion.button>
                </div>
                <div className="p-12 text-center space-y-12">
                  <p className="text-3xl font-bold text-slate-700 leading-relaxed">{selectedChapter.learn.concept}</p>
                  <div className="bg-slate-50 p-12 rounded-3xl border-4 border-dashed border-slate-200 inline-block">
                    <pre className="text-6xl font-black text-pink-500 font-sans whitespace-pre-wrap">{selectedChapter.learn.visual}</pre>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'practice' && selectedChapter && (
            <motion.div 
              key="practice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <button onClick={() => setView('modules')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-pink-500 transition-colors">
                <ChevronLeft className="w-5 h-5" /> Back to Chapter
              </button>
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-yellow-100">
                <div className="bg-yellow-500 p-6 flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white">Practice Worksheet</h3>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    onClick={() => speak(selectedChapter.practice[currentQuestionIndex].help || '')}
                    className="bg-white text-yellow-600 px-4 py-2 rounded-full font-black flex items-center gap-2"
                  >
                    <Lightbulb className="w-5 h-5" /> Help
                  </motion.button>
                </div>
                <div className="p-8 space-y-8">
                  <div className="bg-slate-50 p-8 rounded-2xl border-2 border-slate-100 text-center">
                    <p className="text-3xl font-black text-slate-700">{selectedChapter.practice[currentQuestionIndex].q}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedChapter.practice[currentQuestionIndex].options.map((opt, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleAnswer(opt)}
                        disabled={selectedAnswer !== null}
                        className={`p-6 rounded-2xl text-2xl font-black transition-all border-b-4 ${
                          selectedAnswer === opt 
                            ? (isCorrect ? 'bg-green-500 text-white border-green-700' : 'bg-red-500 text-white border-red-700') 
                            : 'bg-white text-slate-700 border-slate-200 hover:border-yellow-400 hover:bg-yellow-50'
                        }`}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                  {selectedAnswer && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-slate-50 border-2 border-slate-100 space-y-4">
                      <p className={`text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{isCorrect ? 'Correct! 🌟' : 'Try again next time!'}</p>
                      <p className="text-lg text-slate-600">{selectedChapter.practice[currentQuestionIndex].help}</p>
                      <button onClick={() => nextQuestion()} className="w-full bg-yellow-500 text-white py-4 rounded-2xl font-black text-xl shadow-lg border-b-4 border-yellow-700">Next Question</button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'test' && selectedChapter && (
            <motion.div 
              key="test"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <button onClick={() => setView('modules')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-pink-500 transition-colors">
                  <ChevronLeft className="w-5 h-5" /> Quit Test
                </button>
                <div className="bg-white px-4 py-2 rounded-full border-2 border-cyan-100 font-black text-cyan-600">
                  Question {currentQuestionIndex + 1} of {selectedChapter.test.length}
                </div>
              </div>
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-cyan-100">
                <div className="bg-cyan-500 p-6">
                  <h3 className="text-2xl font-black text-white">Final Assessment</h3>
                </div>
                <div className="p-8 space-y-8">
                  <div className="bg-slate-50 p-8 rounded-2xl border-2 border-slate-100 text-center">
                    <p className="text-3xl font-black text-slate-700">{selectedChapter.test[currentQuestionIndex].q}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedChapter.test[currentQuestionIndex].options.map((opt, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleAnswer(opt, true)}
                        disabled={selectedAnswer !== null}
                        className={`p-6 rounded-2xl text-2xl font-black transition-all border-b-4 ${
                          selectedAnswer === opt 
                            ? (isCorrect ? 'bg-green-500 text-white border-green-700' : 'bg-red-500 text-white border-red-700') 
                            : 'bg-white text-slate-700 border-slate-200 hover:border-cyan-400 hover:bg-cyan-50'
                        }`}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                  {selectedAnswer && (
                    <button onClick={() => nextQuestion(true)} className="w-full bg-cyan-500 text-white py-4 rounded-2xl font-black text-xl shadow-lg border-b-4 border-cyan-700">Continue</button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'results' && selectedChapter && (
            <motion.div 
              key="results"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-12 shadow-2xl border-4 border-slate-100 text-center space-y-8"
            >
              <div className="text-8xl">{(score / selectedChapter.test.length) >= 0.8 ? '🏆' : '💪'}</div>
              <div className="space-y-2">
                <h2 className="text-5xl font-black text-slate-800">{(score / selectedChapter.test.length) >= 0.8 ? 'Amazing Job, Jitya!' : 'Good Effort!'}</h2>
                <p className="text-2xl text-slate-500 font-medium">You scored {score} out of {selectedChapter.test.length}</p>
              </div>
              <div className={`text-6xl font-black ${(score / selectedChapter.test.length) >= 0.8 ? 'text-green-500' : 'text-slate-400'}`}>
                {Math.round((score / selectedChapter.test.length) * 100)}%
              </div>
              <div className="flex flex-col gap-4">
                <button onClick={() => setView('test')} className="bg-cyan-500 text-white py-4 rounded-2xl font-black text-xl shadow-lg border-b-4 border-cyan-700">Try Again</button>
                <button onClick={() => setView('home')} className="bg-white text-slate-500 py-4 rounded-2xl font-black text-xl border-2 border-slate-200">Back to Index</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-12 text-center text-slate-400 font-medium">
        <p>© 2025 KidTutor • Making Learning Fun for Jitya! ✨</p>
      </footer>
    </div>
  );
}



