create extension if not exists "pgcrypto";

create type public.user_role as enum ('student', 'admin');
create type public.exam_type as enum ('utme');
create type public.practice_mode as enum ('practice');
create type public.question_source as enum ('ALOC');
create type public.report_status as enum ('open', 'resolved');
create type public.report_issue_type as enum ('question', 'answer', 'solution', 'duplicate', 'other');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role public.user_role not null default 'student',
  target_exam public.exam_type not null default 'utme',
  selected_subjects text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_active_at timestamptz
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  external_source public.question_source not null default 'ALOC',
  external_question_id text not null,
  exam_type public.exam_type not null default 'utme',
  subject text not null,
  year integer,
  question_text text not null,
  options jsonb not null default '{}'::jsonb,
  correct_answer text not null,
  source_explanation text,
  raw_payload jsonb not null default '{}'::jsonb,
  is_disabled boolean not null default false,
  local_override_answer text,
  local_override_explanation text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (external_source, external_question_id, subject)
);

create table public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_type public.exam_type not null default 'utme',
  subject text not null,
  year integer,
  mode public.practice_mode not null default 'practice',
  total_questions integer not null check (total_questions > 0),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  score integer,
  accuracy numeric(5,2),
  duration_seconds integer,
  concept_tags jsonb not null default '[]'::jsonb
);

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.practice_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id),
  selected_answer text not null,
  correct_answer text not null,
  is_correct boolean not null,
  time_spent_seconds integer,
  created_at timestamptz not null default now(),
  unique (session_id, question_id)
);

create table public.tutor_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid references public.practice_sessions(id) on delete cascade,
  question_id uuid references public.questions(id),
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.question_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id),
  subject text not null,
  session_id uuid references public.practice_sessions(id) on delete set null,
  issue_type public.report_issue_type not null,
  message text,
  status public.report_status not null default 'open',
  forwarded_to_aloc boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.ai_usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid references public.practice_sessions(id) on delete set null,
  question_id uuid references public.questions(id),
  tokens_in integer not null default 0,
  tokens_out integer not null default 0,
  created_at timestamptz not null default now()
);

create index questions_exam_subject_idx on public.questions (exam_type, subject) where is_disabled = false;
create index practice_sessions_user_started_idx on public.practice_sessions (user_id, started_at desc);
create index attempts_user_created_idx on public.attempts (user_id, created_at desc);
create index question_reports_status_idx on public.question_reports (status, created_at desc);
create index ai_usage_logs_user_created_idx on public.ai_usage_logs (user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger questions_set_updated_at
before update on public.questions
for each row execute function public.set_updated_at();

create trigger tutor_conversations_set_updated_at
before update on public.tutor_conversations
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.practice_sessions enable row level security;
alter table public.attempts enable row level security;
alter table public.tutor_conversations enable row level security;
alter table public.question_reports enable row level security;
alter table public.ai_usage_logs enable row level security;

create policy "profiles_select_own" on public.profiles
for select using (id = auth.uid() or public.is_admin());

create policy "profiles_insert_own" on public.profiles
for insert with check (id = auth.uid());

create policy "profiles_update_own" on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid());

create policy "questions_read_authenticated" on public.questions
for select to authenticated using (is_disabled = false or public.is_admin());

create policy "questions_admin_all" on public.questions
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "practice_sessions_own" on public.practice_sessions
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "attempts_own" on public.attempts
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "tutor_conversations_own" on public.tutor_conversations
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "question_reports_own_select" on public.question_reports
for select to authenticated using (user_id = auth.uid() or public.is_admin());

create policy "question_reports_own_insert" on public.question_reports
for insert to authenticated with check (user_id = auth.uid());

create policy "question_reports_admin_update" on public.question_reports
for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "ai_usage_logs_own_select" on public.ai_usage_logs
for select to authenticated using (user_id = auth.uid() or public.is_admin());

create policy "ai_usage_logs_service_insert" on public.ai_usage_logs
for insert to authenticated with check (user_id = auth.uid());
