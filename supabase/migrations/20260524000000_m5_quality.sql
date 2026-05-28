create type public.tutor_feedback_rating as enum ('up', 'down');

create table public.tutor_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references public.practice_sessions(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  rating public.tutor_feedback_rating not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, session_id, question_id)
);

create index tutor_feedback_user_created_idx on public.tutor_feedback (user_id, created_at desc);

create trigger tutor_feedback_set_updated_at
before update on public.tutor_feedback
for each row execute function public.set_updated_at();

alter table public.tutor_feedback enable row level security;

create policy "tutor_feedback_own" on public.tutor_feedback
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "tutor_feedback_admin_select" on public.tutor_feedback
for select to authenticated
using (public.is_admin());
