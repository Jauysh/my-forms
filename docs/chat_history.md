# Чат пен Талқылау Тарихы (Chat History Log)

Бұл құжат жоба бойынша қабылданған барлық ұсыныстар мен талқылаулардың хронологиялық тарихын сақтайды.

---

## 2026-10-13 (Бастапқы талқылау және ортаны баптау)

### 1. Құжаттау және Git сақтау стратегиясы
* **Пайдаланушы ұсынысы**:
  * Жобаны кодтау алдында жан-жақты талқылау;
  * Жобаны GitHub-қа (`https://github.com/Jauysh/my-forms.git`) сақтау;
  * Чатты терең диагностика үшін сақтау және жедел қарау үшін шешімдерді Markdown-ға тіркеу.
* **Нәтиже**:
  * `docs/architecture.md`, `docs/requirements.md`, `docs/decisions.md` және `docs/chat_history.md` құрылды.

### 2. Технологиялық стек бекітілді
* **Git**: Нұсқаларды бақылау жүйесі (`origin: https://github.com/Jauysh/my-forms.git`).
* **Docker**: Локальді әзірлеу және мектептік локальді оффлайн емтихан сервері.
* **Vercel**: Next.js бұлттық деплойы.
* **Supabase**: Аутентификация, PostgreSQL дерекқоры, RLS, Storage және Realtime.

### 3. Техникалық мәселелер мен шешімдер
* **Мәселе**: Antigravity ортасында Node.js табылмауы және қате телеметрия хукі (`googlecloudtools.datacloud_telemetry`) құралдардың орындалуына кедергі келтірді.
* **Шешім**:
  * Node.js v24.21.0 орнатылды.
  * Қате плагин жойылды (`Remove-Item -Recurse -Force "C:\Users\a.jauysh\.gemini\config\plugins\googlecloudtools.datacloud_telemetry"`).
  * Antigravity құралдары толықтай тұрақты жұмыс істеуге көшті.

---

## 2026-10-13 (Тереңдетілген талқылау: Емтихан қауіпсіздігі және Мектеп талаптары)

### 1. Жүйенің басты миссиясы
* Google Forms сияқты қарапайым формалардың емтихандардағы осалдықтарын жою (аккаунтты сырттан біреудің пайдаланып кетуі, көшіру, басқа сайттарға өту).
* Мектепке арналған арнайы қауіпсіз әрі ақылды платформа жасау.

### 2. Қабылданған негізгі шешімдер
* **Анти-көшіру және Прокторинг**:
  * Бір құрылғы шектеуі (Single Active Session Lock);
  * Сыныптық уақытша PIN-код (Classroom OTP);
  * Толық экран режимі, беттен кетуді секундпен тіркеу (3 ескерту), көшіруді (`Ctrl+C`, тінтуірдің оң батырмасы) өшіру.
* **Гибридті жұмыс режимі**:
  * Онлайн (Vercel + Supabase);
  * Локальді Оффлайн (Docker арқылы мектеп ішінде сыртқы интернетсіз оқшауланған емтихан өткізу).
* **AI Бағалаушы Агент**:
  * Ашық жауаптарды критерийлер бойынша тексеру және жеке кері байланыс жасау;
  * Мұғалімнің мақұлдауы (Human-in-the-loop).
* **Сұрақ түрлері (9 тип)**:
  * Бір таңдау, бірнеше таңдау, қысқа мәтін/сан, ашық мәтін/эссе, математикалық формулалар (KaTeX), сәйкестендіру, реттеу, бос орынды толтыру, есеп шешімінің суретін тіркеу.
  * Drag-and-drop арқылы сұрақтарды басқару.
* **Нәтижелер мен Аналитика**:
  * Мұғалімнің Live мониторы;
  * Сұрақтардың қиындық индексі (Item difficulty analysis);
  * Google Sheets онлайн синхронизациясы, Excel/PDF экспорты.

---

## 2026-10-13 (1-қадам: Next.js жобасы, Прокторинг және Docker құрылды)

### Атқарылған техникалық жұмыстар:
1. **Next.js 16 (React 19, TypeScript, Tailwind CSS 4)** базалық қосымшасы құрылды.
2. **Қосымша кітапханалар орнатылды**:
   * `lucide-react` (интерфейс белгішелері);
   * `@supabase/supabase-js`, `@supabase/ssr` (Supabase интеграциясы);
   * `katex`, `@types/katex` (математикалық/физикалық формулаларды көрсету);
   * `clsx`, `tailwind-merge` (стильдер utility).
3. **Негізгі модульдер мен компоненттер жазылды**:
   * [`src/types/exam.ts`](file:///c:/Users/a.jauysh/Desktop/my-forms/src/types/exam.ts) — Сұрақ түрлері, емтихан, нәтиже және прокторинг типтері;
   * [`src/hooks/useProctoring.ts`](file:///c:/Users/a.jauysh/Desktop/my-forms/src/hooks/useProctoring.ts) — Толық экранды бақылау, беттен кетуді секундпен тіркеу, көшіруді (`Ctrl+C`) бұғаттау;
   * [`src/components/KaTeXRenderer.tsx`](file:///c:/Users/a.jauysh/Desktop/my-forms/src/components/KaTeXRenderer.tsx) — Формулаларды жоғары сапада визуализациялау;
   * [`src/app/page.tsx`](file:///c:/Users/a.jauysh/Desktop/my-forms/src/app/page.tsx) — PIN-код арқылы емтиханға кіру және платформа презентациясы;
   * [`src/app/exam/demo/page.tsx`](file:///c:/Users/a.jauysh/Desktop/my-forms/src/app/exam/demo/page.tsx) — Толыққанды оқушы емтихан тапсыру беті (5 нақты сұрақ, таймер, AI эссе тексеру, қауіпсіздік ескертулері);
   * [`src/app/teacher/page.tsx`](file:///c:/Users/a.jauysh/Desktop/my-forms/src/app/teacher/page.tsx) — Мұғалімнің Live Classroom Proctoring мониторы, PIN-кодты басқару, Google Sheets/Excel экспорт, Сұрақтар сапасын талдау (Item difficulty);
   * [`supabase/schema.sql`](file:///c:/Users/a.jauysh/Desktop/my-forms/supabase/schema.sql) — Толық PostgreSQL дерекқор сұлбасы және RLS саясаттары;
   * [`Dockerfile`](file:///c:/Users/a.jauysh/Desktop/my-forms/Dockerfile) және [`docker-compose.yml`](file:///c:/Users/a.jauysh/Desktop/my-forms/docker-compose.yml) — Оффлайн және локальді режимде контейнерді іске қосу.
4. **Компиляция мен Тексеру**:
   * `npm run build` сәтті орындалды (0 қате).
   * Код толықтай GitHub репозиторийіне жіберілді (`main -> main`).
