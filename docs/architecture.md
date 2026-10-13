# Жоба архитектурасы (Architecture)

Бұл құжат `my-forms` (Secure Smart Exam & Assessment Platform) платформасының жүйелік архитектурасын, гибридті жұмыс істеу режимін және модульдер байланысын сипаттайды.

---

## 1. Жүйенің гибридті архитектуралық сұлбасы

Платформа **Онлайн (Бұлттық)** және **Оффлайн (Локальді сыныптық сервер)** режимінде жұмыс істей алады:

```mermaid
graph TD
    subgraph Онлайн Режим [Cloud Architecture]
        VercelClient[Vercel: Next.js Frontend & Server Actions]
        SupabaseCloud[(Supabase Cloud: Auth, DB, Realtime, Storage)]
        AIAgent[LLM AI Grading Service API]
        VercelClient <-->|REST / WebSockets| SupabaseCloud
        VercelClient <-->|Async Tasks| AIAgent
    end

    subgraph Оффлайн / Мектептік Локальді Режим [Local Docker Architecture]
        LocalHost[Мектеп Сервері: Docker Compose]
        LocalNext[Local Next.js Container]
        LocalPostgres[(Local PostgreSQL / Supabase Container)]
        ClassPC1[Сынып Компьютері 1]
        ClassPC2[Сынып Компьютері 2]
        ClassPCN[Сынып Компьютері N]
        
        LocalHost --- LocalNext
        LocalHost --- LocalPostgres
        ClassPC1 -->|Local LAN 192.168.x.x| LocalNext
        ClassPC2 -->|Local LAN 192.168.x.x| LocalNext
        ClassPCN -->|Local LAN 192.168.x.x| LocalNext
    end

    LocalHost -.->|Интернет қосылғанда синхронизация| SupabaseCloud
```

---

## 2. Негізгі модульдер мен сервистер

### 2.1. Proctoring Engine (Прокторинг қозғалтқышы)
* **Session Manager**: Оқушының активті құрылғысын бақылау, параллель кірулерді болдырмау.
* **Focus & Event Tracker**: Клиенттік браузердің `visibilitychange`, `blur`, `fullscreenchange` оқиғаларын бақылап, бұзушылық журналдарын тіркейді.
* **Realtime Broadcast**: Supabase Realtime (WebSockets) арқылы мұғалімнің мониторына нақты уақытта ескертулер мен күйлерді жіберіп отырады.

### 2.2. Form & Question Engine
* **Dynamic Form Renderer**: Мектепке қажетті 9 түрлі сұрақ типін және формулаларды (KaTeX / LaTeX) визуализациялау.
* **Drag-and-Drop Builder**: Сұрақтар блогын құрастыру кезінде ыңғайлы сұрыптау (`@dnd-kit` немесе ұқсас заманауи кітапхана).

### 2.3. AI Grading Agent (Жасанды Интеллектпен бағалау)
* **Prompt Engine & Rubrics**: Мұғалімнің критерийлері бойынша ашық жауаптар мен эсселерді сараптау.
* **Evaluation Pipeline**: Балл ұсыну, оқушыға конструктивті кері байланыс және плагиат қаупі туралы мұғалімге есеп беру.

### 2.4. Integration & Export Service
* Google Sheets API арқылы нәтижелерді онлайн кестеге экспорттау.
* Excel (.xlsx), CSV және баға ведомосының PDF генераторы.

---

## 3. Дерекқор құрылымы (Database Schema Outline)

```mermaid
erDiagram
    USERS ||--o{ EXAMS : creates
    USERS ||--o{ SESSIONS : has
    EXAMS ||--o{ QUESTIONS : contains
    EXAMS ||--o{ SUBMISSIONS : receives
    SUBMISSIONS ||--o{ ANSWERS : includes
    SUBMISSIONS ||--o{ PROCTOR_LOGS : records
    ANSWERS ||--o| AI_EVALUATIONS : graded_by

    USERS {
        uuid id PK
        string email
        string full_name
        string role "teacher | student"
        timestamp created_at
    }

    EXAMS {
        uuid id PK
        uuid teacher_id FK
        string title
        text description
        string pin_code
        int max_attempts
        int time_limit_minutes
        boolean is_active
        boolean enforce_fullscreen
        boolean block_tab_switch
    }

    QUESTIONS {
        uuid id PK
        uuid exam_id FK
        string question_type
        text prompt
        jsonb options
        jsonb correct_answers
        jsonb grading_rubric
        float points
        int order_index
    }

    SUBMISSIONS {
        uuid id PK
        uuid exam_id FK
        uuid student_id FK
        string session_token
        string status "in_progress | completed | terminated"
        float total_score
        timestamp started_at
        timestamp completed_at
    }

    PROCTOR_LOGS {
        uuid id PK
        uuid submission_id FK
        string event_type "tab_switch | fullscreen_exit | copy_attempt | multi_device"
        text details
        int duration_seconds
        timestamp created_at
    }

    ANSWERS {
        uuid id PK
        uuid submission_id FK
        uuid question_id FK
        jsonb response_data
        float awarded_points
        boolean is_auto_graded
    }

    AI_EVALUATIONS {
        uuid id PK
        uuid answer_id FK
        float suggested_score
        text feedback_text
        text teacher_comment
        boolean is_approved_by_teacher
    }
```
