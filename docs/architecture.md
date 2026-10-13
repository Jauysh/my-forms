# Жоба архитектурасы (Architecture)

Бұл құжат `my-forms` қосымшасының жүйелік архитектурасын, компоненттерін және өзара әрекеттесу сызбасын сипаттайды.

---

## 1. Жалпы архитектуралық сұлба

```mermaid
graph TD
    User([Қолданушы / Респондент]) -->|HTTPS / DNS| Vercel[Vercel Platform]
    Vercel -->|Next.js App Router| Frontend[Frontend UI & Server Actions]
    Frontend -->|Supabase Client SDK / RLS| Supabase[Supabase Cloud]
    
    subgraph Supabase Platform
        Auth[Supabase Auth (JWT)]
        DB[(PostgreSQL)]
        Storage[Supabase Storage (Files/Images)]
    end
    
    subgraph Local Dev & CI/CD
        Docker[Docker & Docker Compose]
        Git[GitHub Repository]
    end
```

---

## 2. Негізгі модульдер мен компоненттер

### 2.1. Клиенттік және Серверлік бөлік (Next.js & Vercel)
* **App Router**: Модульдік беттер мен бағыттар (`/forms`, `/forms/[id]`, `/dashboard`, `/analytics`).
* **Server Actions**: Қауіпсіз деректер жазу мен өңдеу (форма құру, жауаптарды қабылдау).
* **UI кітапханасы**: Tailwind CSS және shadcn/ui арқылы икемді, стильді және ыңғайлы интерфейс.

### 2.2. Дерекқор және Қауіпсіздік (Supabase)
* **PostgreSQL Schema**:
  * `profiles`: Қолданушылар профилі.
  * `forms`: Формалардың метадеректері (атауы, сипаттамасы, параметрлері, авторы).
  * `form_fields`: Форманың сұрақтары/өрістері (сұрақ түрі, міндеттілігі, опциялары, рет нөмірі).
  * `submissions`: Толтырылған жауап сессиялары (уақыты, респондент деректері).
  * `answers`: Нақты сұраққа берілген жауаптар.
* **Row Level Security (RLS)**:
  * Әрбір форма авторы тек өз формаларын өңдей алады және тек өз формасының жауаптарын көре алады.
  * Респонденттер ашық формаларды ғана оқи алады және жаңа жауап қоса алады.

### 2.3. Контейнерлеу (Docker)
* `Dockerfile` және `docker-compose.yml` арқылы жергілікті ортаны кез келген құрылғыда қатесіз көтеруге мүмкіндік береді.
