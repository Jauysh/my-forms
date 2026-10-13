-- Supabase Schema for Secure Smart Exam & Assessment Platform (my-forms)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Teachers & Students)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  role text not null default 'student' check (role in ('teacher', 'student', 'admin')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- 2. Exams Table
create table if not exists public.exams (
  id uuid default gen_random_uuid() primary key,
  teacher_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text default '',
  pin_code varchar(6),
  time_limit_minutes int default 45,
  max_attempts int default 1,
  is_active boolean default true,
  enforce_fullscreen boolean default true,
  block_tab_switch boolean default true,
  allow_calculator boolean default false,
  created_at timestamptz default now()
);

alter table public.exams enable row level security;

create policy "Teachers can manage their own exams"
  on public.exams for all
  to authenticated
  using (auth.uid() = teacher_id);

create policy "Students can view active exams"
  on public.exams for select
  to authenticated
  using (is_active = true);

-- 3. Questions Table
create table if not exists public.questions (
  id uuid default gen_random_uuid() primary key,
  exam_id uuid references public.exams(id) on delete cascade not null,
  question_type text not null check (
    question_type in (
      'single_choice',
      'multiple_choice',
      'short_text',
      'essay',
      'formula',
      'matching',
      'ordering',
      'fill_blanks',
      'file_upload'
    )
  ),
  prompt text not null,
  options jsonb default '[]'::jsonb,
  correct_answers jsonb default '[]'::jsonb,
  rubric text default '',
  points numeric default 1.0,
  order_index int default 0,
  created_at timestamptz default now()
);

alter table public.questions enable row level security;

create policy "Teachers can manage questions for their exams"
  on public.questions for all
  to authenticated
  using (
    exists (
      select 1 from public.exams
      where exams.id = questions.exam_id and exams.teacher_id = auth.uid()
    )
  );

create policy "Students can view questions for active exams"
  on public.questions for select
  to authenticated
  using (
    exists (
      select 1 from public.exams
      where exams.id = questions.exam_id and exams.is_active = true
    )
  );

-- 4. Submissions Table (Exam Attempts)
create table if not exists public.submissions (
  id uuid default gen_random_uuid() primary key,
  exam_id uuid references public.exams(id) on delete cascade not null,
  student_id uuid references public.profiles(id) on delete cascade not null,
  session_token text not null,
  device_fingerprint text,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'terminated')),
  total_score numeric default 0,
  violation_count int default 0,
  started_at timestamptz default now(),
  completed_at timestamptz
);

alter table public.submissions enable row level security;

create policy "Students can view and insert their own submissions"
  on public.submissions for all
  to authenticated
  using (auth.uid() = student_id);

create policy "Teachers can view all submissions for their exams"
  on public.submissions for select
  to authenticated
  using (
    exists (
      select 1 from public.exams
      where exams.id = submissions.exam_id and exams.teacher_id = auth.uid()
    )
  );

-- 5. Answers Table
create table if not exists public.answers (
  id uuid default gen_random_uuid() primary key,
  submission_id uuid references public.submissions(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete cascade not null,
  response_data jsonb not null default '{}'::jsonb,
  awarded_points numeric default 0,
  is_auto_graded boolean default false,
  feedback text default '',
  created_at timestamptz default now()
);

alter table public.answers enable row level security;

create policy "Students can insert their answers"
  on public.answers for insert
  to authenticated
  with check (
    exists (
      select 1 from public.submissions
      where submissions.id = answers.submission_id and submissions.student_id = auth.uid()
    )
  );

create policy "Students can view their answers"
  on public.answers for select
  to authenticated
  using (
    exists (
      select 1 from public.submissions
      where submissions.id = answers.submission_id and submissions.student_id = auth.uid()
    )
  );

create policy "Teachers can manage answers for their exams"
  on public.answers for all
  to authenticated
  using (
    exists (
      select 1 from public.submissions
      join public.exams on exams.id = submissions.exam_id
      where submissions.id = answers.submission_id and exams.teacher_id = auth.uid()
    )
  );

-- 6. Proctor Logs Table (Anti-Cheating Event Journal)
create table if not exists public.proctor_logs (
  id uuid default gen_random_uuid() primary key,
  submission_id uuid references public.submissions(id) on delete cascade not null,
  event_type text not null check (
    event_type in (
      'tab_switch',
      'fullscreen_exit',
      'copy_attempt',
      'multi_device',
      'focus_lost'
    )
  ),
  details text default '',
  duration_seconds int default 0,
  created_at timestamptz default now()
);

alter table public.proctor_logs enable row level security;

create policy "Students can record their own proctor logs"
  on public.proctor_logs for insert
  to authenticated
  with check (
    exists (
      select 1 from public.submissions
      where submissions.id = proctor_logs.submission_id and submissions.student_id = auth.uid()
    )
  );

create policy "Teachers can view proctor logs for their exams"
  on public.proctor_logs for select
  to authenticated
  using (
    exists (
      select 1 from public.submissions
      join public.exams on exams.id = submissions.exam_id
      where submissions.id = proctor_logs.submission_id and exams.teacher_id = auth.uid()
    )
  );

-- Realtime publication for Live Classroom Proctoring
alter publication supabase_realtime add table public.submissions;
alter publication supabase_realtime add table public.proctor_logs;
