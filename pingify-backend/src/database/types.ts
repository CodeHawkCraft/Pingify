// The TypeScript definitions below are automatically generated.
// Do not touch them, or risk, your modifications being lost.

export enum Table {
  KnexMigrations = "knex_migrations",
  KnexMigrationsLock = "knex_migrations_lock",
  PingLogs = "ping_logs",
  Users = "users",
  Websites = "websites",
}

export type Tables = {
  "knex_migrations": KnexMigrations,
  "knex_migrations_lock": KnexMigrationsLock,
  "ping_logs": PingLogs,
  "users": Users,
  "websites": Websites,
};

export type KnexMigrations = {
  id: number;
  name: string | null;
  batch: number | null;
  migration_time: Date | null;
};

export type KnexMigrationsLock = {
  index: number;
  is_locked: number | null;
};

export type PingLogs = {
  id: string;
  website_id: string;
  status_code: number | null;
  response_time_ms: number | null;
  status: string;
  error: string | null;
  pinged_at: Date;
};

export type Users = {
  id: string;
  username: string;
  password: string;
  created_at: Date;
};

export type Websites = {
  id: string;
  url: string;
  user_id: string;
  created_at: Date | null;
  updated_at: Date | null;
  next_ping_at: Date;
};

