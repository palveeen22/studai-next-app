-- ============================================
-- StudAI Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

create extension if not exists "pgcrypto";

-- ============================================
-- TABLES
-- ============================================

-- profiles (extends auth.users)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  avatar_url text,
  created_at timestamptz default now()
);

-- subjects
create table subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  icon text not null,
  color text not null,
  created_at timestamptz default now()
);

-- tasks
create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  subject_id uuid references subjects(id) on delete cascade not null,
  title text not null,
  description text,
  deadline timestamptz,
  completed boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- ai_summaries
create table ai_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  original_text text not null,
  bullets text[] not null,
  created_at timestamptz default now()
);

-- ai_quizzes
create table ai_quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  questions jsonb not null,
  created_at timestamptz default now()
);

-- daily_quiz_tasks
create table daily_quiz_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  topic text not null,
  duration int not null,
  questions_per_day int not null,
  preparation_goal text not null,
  current_streak int default 0,
  longest_streak int default 0,
  is_archived boolean default false,
  created_at timestamptz default now()
);

-- daily_quiz_results
create table daily_quiz_results (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references daily_quiz_tasks(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  day_index int not null,
  score int not null,
  total_questions int not null,
  completed_at timestamptz default now()
);

-- ai_usage (reset daily)
create table ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date default current_date,
  summaries_used int default 0,
  quizzes_used int default 0,
  unique(user_id, date)
);

-- subscriptions
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  tier text default 'free',
  is_active boolean default false,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table profiles enable row level security;
alter table subjects enable row level security;
alter table tasks enable row level security;
alter table ai_summaries enable row level security;
alter table ai_quizzes enable row level security;
alter table daily_quiz_tasks enable row level security;
alter table daily_quiz_results enable row level security;
alter table ai_usage enable row level security;
alter table subscriptions enable row level security;

-- Profiles
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Subjects
create policy "Users can view own subjects" on subjects for select using (auth.uid() = user_id);
create policy "Users can create own subjects" on subjects for insert with check (auth.uid() = user_id);
create policy "Users can update own subjects" on subjects for update using (auth.uid() = user_id);
create policy "Users can delete own subjects" on subjects for delete using (auth.uid() = user_id);

-- Tasks
create policy "Users can view own tasks" on tasks for select using (auth.uid() = user_id);
create policy "Users can create own tasks" on tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on tasks for update using (auth.uid() = user_id);
create policy "Users can delete own tasks" on tasks for delete using (auth.uid() = user_id);

-- AI Summaries
create policy "Users can view own summaries" on ai_summaries for select using (auth.uid() = user_id);
create policy "Users can create own summaries" on ai_summaries for insert with check (auth.uid() = user_id);

-- AI Quizzes
create policy "Users can view own quizzes" on ai_quizzes for select using (auth.uid() = user_id);
create policy "Users can create own quizzes" on ai_quizzes for insert with check (auth.uid() = user_id);

-- Daily Quiz Tasks
create policy "Users can view own daily quiz tasks" on daily_quiz_tasks for select using (auth.uid() = user_id);
create policy "Users can create own daily quiz tasks" on daily_quiz_tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own daily quiz tasks" on daily_quiz_tasks for update using (auth.uid() = user_id);
create policy "Users can delete own daily quiz tasks" on daily_quiz_tasks for delete using (auth.uid() = user_id);

-- Daily Quiz Results
create policy "Users can view own quiz results" on daily_quiz_results for select using (auth.uid() = user_id);
create policy "Users can create own quiz results" on daily_quiz_results for insert with check (auth.uid() = user_id);

-- AI Usage
create policy "Users can view own usage" on ai_usage for select using (auth.uid() = user_id);
create policy "Users can insert own usage" on ai_usage for insert with check (auth.uid() = user_id);
create policy "Users can update own usage" on ai_usage for update using (auth.uid() = user_id);

-- Subscriptions
create policy "Users can view own subscription" on subscriptions for select using (auth.uid() = user_id);
create policy "Users can insert own subscription" on subscriptions for insert with check (auth.uid() = user_id);
create policy "Users can update own subscription" on subscriptions for update using (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-create profile + free subscription on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'Student'));

  insert into public.subscriptions (user_id, tier, is_active)
  values (new.id, 'free', true);

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-set completed_at when task is toggled
create or replace function public.handle_task_completion()
returns trigger as $$
begin
  if new.completed = true and old.completed = false then
    new.completed_at = now();
  elsif new.completed = false then
    new.completed_at = null;
  end if;
  return new;
end;
$$ language plpgsql;

create or replace trigger on_task_toggle
  before update on tasks
  for each row execute procedure public.handle_task_completion();
