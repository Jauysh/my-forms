'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Award,
  ArrowLeft,
} from 'lucide-react';
import { useProctoring } from '@/hooks/useProctoring';
import { KaTeXRenderer } from '@/components/KaTeXRenderer';

export default function ExamDemoPage() {
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes

  // Answers state
  const [answers, setAnswers] = useState<Record<string, any>>({
    q1: '',
    q2: '',
    q3: { 1: '', 2: '', 3: '' },
    q4: ['1465 жыл', '1723 жыл', '1991 жыл'], // ordering
    q5: '',
  });

  const [aiFeedback, setAiFeedback] = useState<{
    score: number;
    feedback: string;
  } | null>(null);
  const [isAiGrading, setIsAiGrading] = useState(false);

  const {
    violations,
    violationCount,
    warningMessage,
    enterFullscreen,
    isFullscreen,
  } = useProctoring({
    enforceFullscreen: examStarted && !examSubmitted,
    blockTabSwitch: examStarted && !examSubmitted,
    maxViolations: 3,
    onViolationThresholdReached: () => {
      setExamSubmitted(true);
      alert('Емтихан ережесі 3 рет бұзылды! Жұмыс автоматты түрде тапсырылды.');
    },
  });

  // Timer countdown
  useEffect(() => {
    if (!examStarted || examSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setExamSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examStarted, examSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startExam = async () => {
    await enterFullscreen();
    setExamStarted(true);
  };

  const handleAiGrade = () => {
    if (!answers.q5.trim()) {
      alert('Эссе жауабын жазыңыз!');
      return;
    }
    setIsAiGrading(true);
    setTimeout(() => {
      setIsAiGrading(false);
      setAiFeedback({
        score: 4.5,
        feedback:
          'AI Талдауы: Жауапта негізгі тарихи фактілер мен себеп-салдарлық байланыстар өте жақсы ашылған. Ұсыныс: Қорытынды бөлімін нақты мысалмен нығайтуға болады.',
      });
    }, 1500);
  };

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 border border-indigo-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            Қазақстан тарихы және Математика (Демо Емтихан)
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            Емтиханды бастамас бұрын мына қауіпсіздік талаптарымен танысыңыз:
          </p>

          <div className="space-y-3 bg-slate-950/70 p-5 rounded-2xl border border-slate-800 mb-8 text-xs text-slate-300">
            <div className="flex items-center gap-2.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Бір құрылғы шектеуі: Бұл сессия тек осы компьютерде өтеді.</span>
            </div>
            <div className="flex items-center gap-2.5 text-amber-400 font-medium">
              <AlertTriangle className="w-4 h-4" />
              <span>Толық экран режимі: Браузерден немесе басқа қосымшаға ауысуға болмайды.</span>
            </div>
            <div className="flex items-center gap-2.5 text-rose-400 font-medium">
              <ShieldAlert className="w-4 h-4" />
              <span>3 ескерту шегі: Ережені 3 рет бұзсаңыз, тест автоматты жабылады.</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400">
              <Clock className="w-4 h-4" />
              <span>Берілген уақыт: 45 минут. Сұрақтар саны: 5.</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Артқа
            </Link>
            <button
              onClick={startExam}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <Maximize2 className="w-4 h-4" />
              Толық экранда емтиханды бастау
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (examSubmitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <Award className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Емтихан сәтті аяқталды!</h1>
          <p className="text-sm text-slate-400 mb-6">
            Жауаптарыңыз қабылданды және тексеру журналына жіберілді.
          </p>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-left space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Тапсырған уақыты:</span>
              <span className="text-white font-medium">
                {formatTime(45 * 60 - timeLeft)} қолданылды
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Прокторинг ескертулері:</span>
              <span
                className={`font-medium ${
                  violationCount === 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {violationCount} рет анықталды
              </span>
            </div>
            <div className="flex justify-between text-sm border-t border-slate-800 pt-2">
              <span className="text-slate-400">Тест нәтижесі (Автоматты):</span>
              <span className="text-indigo-400 font-bold text-base">4.5 / 5 балл</span>
            </div>
          </div>

          <Link
            href="/"
            className="block w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition"
          >
            Басты бетке оралу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none">
      {/* Warning banner if violation occurs */}
      {warningMessage && (
        <div className="bg-rose-600 text-white px-4 py-2.5 text-center text-sm font-semibold flex items-center justify-center gap-2 sticky top-0 z-50 animate-pulse">
          <AlertTriangle className="w-5 h-5" />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-3 flex items-center justify-between sticky top-0 z-40 backdrop-blur">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-white">Қазақстан тарихы & Математика</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300 border border-slate-700">
            <span>Ескертулер:</span>
            <span
              className={`font-bold ${
                violationCount > 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {violationCount} / 3
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 font-mono text-sm text-indigo-300">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <button
            onClick={() => setExamSubmitted(true)}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Тапсыру
          </button>
        </div>
      </header>

      {/* Main Exam Area */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-6 flex flex-col md:flex-row gap-6">
        {/* Question Content */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Сұрақ {currentQuestionIndex + 1} / 5
              </span>
              <span className="text-xs text-slate-400">1 балл</span>
            </div>

            {/* Question 1: Single Choice */}
            {currentQuestionIndex === 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-6">
                  Қазақ хандығының негізін қалаған хандар кімдер?
                </h2>
                <div className="space-y-3">
                  {[
                    'Керей мен Жәнібек',
                    'Қасым мен Хақназар',
                    'Тәуке мен Абылай',
                    'Есім мен Тұрсын',
                  ].map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition cursor-pointer ${
                        answers.q1 === opt
                          ? 'border-indigo-500 bg-indigo-500/10 text-white'
                          : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="q1"
                        checked={answers.q1 === opt}
                        onChange={() => setAnswers({ ...answers, q1: opt })}
                        className="accent-indigo-500"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Question 2: Math Formula with KaTeX */}
            {currentQuestionIndex === 1 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">
                  Квадраттық теңдеудің түбірлерін анықтаңыз:
                </h2>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl mb-6 text-center text-xl text-indigo-300">
                  <KaTeXRenderer math="x^2 - 5x + 6 = 0" block={true} />
                </div>
                <div className="space-y-3">
                  {[
                    '\\(x_1 = 2,\\ x_2 = 3\\)',
                    '\\(x_1 = -2,\\ x_2 = -3\\)',
                    '\\(x_1 = 1,\\ x_2 = 6\\)',
                    '\\(x_1 = -1,\\ x_2 = 5\\)',
                  ].map((opt, i) => (
                    <label
                      key={i}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition cursor-pointer ${
                        answers.q2 === opt
                          ? 'border-indigo-500 bg-indigo-500/10 text-white'
                          : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="q2"
                        checked={answers.q2 === opt}
                        onChange={() => setAnswers({ ...answers, q2: opt })}
                        className="accent-indigo-500"
                      />
                      <span>
                        <KaTeXRenderer math={opt.replace(/\\\(|\\\)/g, '')} />
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Question 3: Matching (Сәйкестендіру) */}
            {currentQuestionIndex === 2 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">
                  Тарихи тұлғалар мен олардың еңбектерін сәйкестендіріңіз:
                </h2>
                <p className="text-xs text-slate-400 mb-6">
                  Әрбір тұлғаның қасына сәйкес келетін еңбегін таңдаңыз.
                </p>
                <div className="space-y-4">
                  {[
                    { id: 1, name: 'Жүсіп Баласағұн', default: 'Құтты білік' },
                    { id: 2, name: 'Махмұд Қашқари', default: 'Диуани лұғат ат-түрк' },
                    { id: 3, name: 'Қожа Ахмет Ясауи', default: 'Диуани хикмет' },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800"
                    >
                      <span className="font-medium text-slate-200">{item.name}</span>
                      <select
                        value={answers.q3[item.id]}
                        onChange={(e) =>
                          setAnswers({
                            ...answers,
                            q3: { ...answers.q3, [item.id]: e.target.value },
                          })
                        }
                        className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="">Таңдаңыз...</option>
                        <option value="Құтты білік">Құтты білік</option>
                        <option value="Диуани лұғат ат-түрк">Диуани лұғат ат-түрк</option>
                        <option value="Диуани хикмет">Диуани хикмет</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Question 4: Ordering (Хронология) */}
            {currentQuestionIndex === 3 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">
                  Тарихи оқиғаларды дұрыс хронологиялық ретпен қойыңыз:
                </h2>
                <p className="text-xs text-slate-400 mb-6">
                  Батырмалар арқылы оқиғалардың орнын ауыстырыңыз:
                </p>
                <div className="space-y-3">
                  {answers.q4.map((item: string, idx: number) => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800"
                    >
                      <span className="text-white font-medium">
                        {idx + 1}. {item}
                      </span>
                      <div className="flex gap-2">
                        {idx > 0 && (
                          <button
                            onClick={() => {
                              const newArr = [...answers.q4];
                              [newArr[idx - 1], newArr[idx]] = [newArr[idx], newArr[idx - 1]];
                              setAnswers({ ...answers, q4: newArr });
                            }}
                            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                          >
                            ▲ Жоғары
                          </button>
                        )}
                        {idx < answers.q4.length - 1 && (
                          <button
                            onClick={() => {
                              const newArr = [...answers.q4];
                              [newArr[idx + 1], newArr[idx]] = [newArr[idx], newArr[idx + 1]];
                              setAnswers({ ...answers, q4: newArr });
                            }}
                            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                          >
                            ▼ Төмен
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Question 5: Essay with AI Grading */}
            {currentQuestionIndex === 4 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">
                  Ашық сұрақ / Эссе (AI арқылы тексеріледі):
                </h2>
                <p className="text-xs text-slate-400 mb-4">
                  «Қазақ хандығының құрылуының тарихи маңызы неде?» тақырыбына қысқаша эссе жазыңыз (кемінде 2-3 сөйлем).
                </p>
                <textarea
                  rows={5}
                  value={answers.q5}
                  onChange={(e) => setAnswers({ ...answers, q5: e.target.value })}
                  placeholder="Өз ойыңызды осында жазыңыз..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 mb-4"
                />

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleAiGrade}
                    disabled={isAiGrading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-medium transition shadow-lg shadow-purple-600/20 disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isAiGrading ? 'AI Тексеруде...' : 'AI Кері байланысын көру'}
                  </button>
                </div>

                {aiFeedback && (
                  <div className="mt-4 p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200">
                    <div className="font-semibold text-purple-300 mb-1 flex items-center justify-between">
                      <span>🤖 AI Бағалау нәтижесі:</span>
                      <span className="bg-purple-500/20 px-2 py-0.5 rounded-full text-purple-200">
                        Балл: {aiFeedback.score} / 5
                      </span>
                    </div>
                    <p>{aiFeedback.feedback}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800 mt-8">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Алдыңғы
            </button>

            {currentQuestionIndex < 4 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(4, prev + 1))}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/20"
              >
                Келесі
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setExamSubmitted(true)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/20"
              >
                <Send className="w-4 h-4" />
                Емтиханды аяқтау
              </button>
            )}
          </div>
        </div>

        {/* Sidebar / Question Palette */}
        <div className="w-full md:w-64 bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit shadow-xl">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Сұрақтар тізімі
          </h3>
          <div className="grid grid-cols-5 md:grid-cols-3 gap-2 mb-6">
            {[0, 1, 2, 3, 4].map((idx) => {
              const isCurrent = currentQuestionIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`h-11 rounded-xl text-xs font-bold transition flex items-center justify-center border ${
                    isCurrent
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="space-y-2 text-xs text-slate-400 border-t border-slate-800 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-md bg-indigo-600" />
              <span>Ағымдағы сұрақ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-md bg-slate-950 border border-slate-800" />
              <span>Қаралмаған сұрақ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
