-- =============================================================
--  Blog Pauta — estrutura do banco (rodar no SQL Editor do Supabase)
-- =============================================================

-- POSTAGENS (mesmos campos da api-fake-blog do professor + conteúdo completo)
create table if not exists public.posts (
  id                  bigint generated always as identity primary key,
  title               text not null,
  description         text not null,          -- resumo mostrado no card
  content             text not null,          -- texto completo ("ler mais")
  thumb_image         text,
  thumb_image_alt     text,
  category            text,
  profile_name        text,
  profile_thumb_image text,
  post_date           date not null default current_date,
  created_at          timestamptz not null default now()
);

-- COMENTÁRIOS (cada comentário pertence a um post e a um usuário do Supabase Auth)
create table if not exists public.comments (
  id          bigint generated always as identity primary key,
  post_id     bigint not null references public.posts(id) on delete cascade,
  user_id     uuid   not null references auth.users(id)   on delete cascade,
  author_name text   not null,
  body        text   not null check (char_length(body) between 1 and 1000),
  created_at  timestamptz not null default now()
);

-- CURTIDAS (um usuário só pode curtir um post uma vez -> chave primária composta)
create table if not exists public.likes (
  post_id    bigint not null references public.posts(id) on delete cascade,
  user_id    uuid   not null references auth.users(id)   on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists comments_post_id_idx on public.comments(post_id);
create index if not exists likes_user_id_idx    on public.likes(user_id);

-- Segurança: RLS ligado e SEM políticas públicas.
-- Só a nossa API (que usa a service_role key) consegue ler/escrever.
alter table public.posts    enable row level security;
alter table public.comments enable row level security;
alter table public.likes    enable row level security;
