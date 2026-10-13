'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Sparkles,
  BookOpen,
  Lock,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight,
  School,
  FileCheck2,
  FileSpreadsheet,
} from 'lucide-react';

export default function Home() {
  const [pinCode, setPinCode] = useState('');

  const handleJoinExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode.trim()) return;
    window.location.href = `/exam/join?pin=${pinCode.trim()}`;
  };

  return (
    <div className="min-vh-100 min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <School className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              MyForms Exam
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
              Қауіпсіз Емтихан
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/teacher"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700"
            >
              Мұғалім кабинеті
            </Link>
            <Link
              href="/exam/demo"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/25"
            >
              Демо тапсыру
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium mb-8">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Google Forms баламасы: Сырттан жазып беру мен көшіруден 100% қорғалған</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight mb-6">
          Мектептерге арналған{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            ақылды әрі қауіпсіз
          </span>{' '}
          емтихан платформасы
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mb-12">
          Бір аккаунттан бірнеше адамның кіруін бұғаттау, экраннан шығуды тіркеу, 9 мектептік сұрақ түрі (формулалар) және AI көмегімен автоматты бағалау.
        </p>

        {/* PIN Code Join Box */}
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl mb-16 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            Оқушы: Емтиханға кіру
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Мұғалім берген 6 таңбалы PIN-кодты енгізіп, емтиханды бастаңыз:
          </p>
          <form onSubmit={handleJoinExam} className="flex gap-2">
            <input
              type="text"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              placeholder="Мысалы: 748291"
              maxLength={6}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-center text-lg tracking-widest font-mono text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 uppercase placeholder:text-slate-600 placeholder:tracking-normal placeholder:font-sans"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/30"
            >
              Кіру
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Анти-көшіру және Прокторинг
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Бір уақытта бір құрылғыдан ғана кіру (Single Device Lock), толық экран режимі, браузерден немесе басқа қосымшаға ауысуды секундпен тіркеу.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              9 мектептік сұрақ және Формулалар
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Тесттер, сәйкестендіру, реттеу, бос орынды толтыру, KaTeX формулалары және қағаздағы шешімнің суретін камерадан жүктеу.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              AI Бағалаушы Агент
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Ашық сұрақтар мен эсселерді мұғалім критерийі бойынша AI арқылы тексеру, әр оқушыға жекелендірілген кері байланыс және Google Sheets синхронизациясы.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p>© 2026 MyForms. Secure Exam & Assessment Platform. Барлық құқықтар қорғалған.</p>
      </footer>
    </div>
  );
}
