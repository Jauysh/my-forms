'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  School,
  Plus,
  Users,
  ShieldAlert,
  Clock,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  Play,
  Pause,
  Key,
  BarChart3,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

interface StudentSession {
  id: string;
  name: string;
  status: 'active' | 'warning' | 'submitted';
  currentQuestion: number;
  violations: number;
  score?: number;
  lastActive: string;
}

export default function TeacherDashboard() {
  const [pinActive, setPinActive] = useState(true);
  const [pinCode] = useState('748291');

  // Simulated live classroom students
  const [students] = useState<StudentSession[]>([
    {
      id: '1',
      name: 'Әлихан Сұлтанов',
      status: 'active',
      currentQuestion: 4,
      violations: 0,
      lastActive: 'қазір',
    },
    {
      id: '2',
      name: 'Аружан Берікқызы',
      status: 'warning',
      currentQuestion: 3,
      violations: 2,
      lastActive: '30 сек бұрын (беттен кетті)',
    },
    {
      id: '3',
      name: 'Данияр Нұрланұлы',
      status: 'active',
      currentQuestion: 5,
      violations: 0,
      lastActive: 'қазір',
    },
    {
      id: '4',
      name: 'Мәдина Қасымова',
      status: 'submitted',
      currentQuestion: 5,
      violations: 0,
      score: 4.8,
      lastActive: 'аяқтады',
    },
  ]);

  const handleExportGoogleSheets = () => {
    alert(
      'Google Sheets-ке сәтті экспортталды! Мұғалімнің кестесіне нәтижелер синхрондалды.'
    );
  };

  const handleExportExcel = () => {
    alert('Excel (.xlsx) файл дайындалып, жүктеуге қойылды.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 sticky top-0 z-50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <School className="w-5 h-5" />
              </div>
              <h1 className="font-bold text-lg text-white">Мұғалім кабинеті</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportGoogleSheets}
              className="px-3.5 py-2 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20 text-xs font-medium flex items-center gap-2 transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Google Sheets-ке синхрондау
            </button>
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              Excel экспорт
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Active Exam Overview Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Белсенді емтихан тікелей эфирде (Live)
            </div>
            <h2 className="text-2xl font-bold text-white">
              Қазақстан тарихы және Математика (9-сынып)
            </h2>
            <p className="text-xs text-slate-400">
              Қосылған оқушылар: 4 | Орташа ұпай: 4.6 | Уақыт шегі: 45 мин
            </p>
          </div>

          {/* PIN Code Panel */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
            <div>
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Сыныптық PIN-код:
              </div>
              <div className="text-2xl font-mono font-extrabold tracking-wider text-indigo-400">
                {pinCode}
              </div>
            </div>
            <button
              onClick={() => setPinActive(!pinActive)}
              className={`p-3 rounded-xl border transition ${
                pinActive
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              }`}
              title={pinActive ? 'PIN-кодты жабу' : 'PIN-кодты ашу'}
            >
              {pinActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Live Proctoring Monitor Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-lg text-white">
                Live Classroom Monitor (Оқушылар жағдайы)
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Сессиялар нақты уақытта жаңартылуда (WebSockets)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {students.map((st) => (
              <div
                key={st.id}
                className={`p-5 rounded-2xl border transition relative overflow-hidden ${
                  st.status === 'warning'
                    ? 'bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-500/10'
                    : st.status === 'submitted'
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-indigo-300">
                    {st.name.charAt(0)}
                  </div>

                  {st.status === 'warning' && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1 animate-pulse">
                      <AlertTriangle className="w-3 h-3" />
                      {st.violations} ескерту!
                    </span>
                  )}

                  {st.status === 'active' && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Белсенді
                    </span>
                  )}

                  {st.status === 'submitted' && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-medium">
                      Тапсырды ({st.score} б)
                    </span>
                  )}
                </div>

                <h4 className="font-semibold text-white text-sm mb-1">{st.name}</h4>
                <div className="space-y-1 text-xs text-slate-400">
                  <p>Сұрақ: {st.currentQuestion} / 5</p>
                  <p className="text-[11px] text-slate-500">Күйі: {st.lastActive}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Item Difficulty Analysis (Сұрақтар сапасын талдау) */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white">
              Сұрақтар сапасы мен қиындығы (Item Difficulty Analysis)
            </h3>
          </div>
          <div className="space-y-4">
            {[
              {
                q: '№1. Қазақ хандығының негізін қалаған хандар',
                correctRate: 100,
                color: 'bg-emerald-500',
              },
              {
                q: '№2. Квадраттық теңдеу түбірлері (KaTeX)',
                correctRate: 25,
                color: 'bg-rose-500',
                note: 'Оқушылардың 75%-ы қателесті! Тақырыпты қайталау ұсынылады.',
              },
              {
                q: '№3. Тарихи тұлғалар мен еңбектерді сәйкестендіру',
                correctRate: 75,
                color: 'bg-indigo-500',
              },
              {
                q: '№4. Хронологиялық реттілік',
                correctRate: 50,
                color: 'bg-amber-500',
              },
            ].map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.q}</span>
                  <span className="font-mono text-slate-400">{item.correctRate}% дұрыс</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${item.correctRate}%` }}
                  />
                </div>
                {item.note && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {item.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
