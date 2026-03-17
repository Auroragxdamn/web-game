import { createHash } from "node:crypto";
import { Database } from "bun:sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "./index";

type MigrationJournal = {
  entries: Array<{
    when: number;
    tag: string;
  }>;
};

const sqlite = new Database("local.db");

const tableExists = (tableName: string) => {
  const result = sqlite
    .query(
      "select name from sqlite_master where type = 'table' and name = ? limit 1",
    )
    .get(tableName);

  return Boolean(result);
};

const getMigrationCount = () => {
  if (!tableExists("__drizzle_migrations")) {
    return 0;
  }

  const result = sqlite.query("select count(*) as count from __drizzle_migrations").get() as
    | { count: number }
    | undefined;

  return result?.count ?? 0;
};

const appSchemaExists = () =>
  ["users", "cards", "user_cards", "user_decks"].some((tableName) => tableExists(tableName));

const hashMigrationFile = (tag: string) => {
  const sql = Bun.file(`./drizzle/${tag}.sql`).text();
  return sql.then((content) => createHash("sha256").update(content).digest("hex"));
};

const seedBaselineMigrations = async () => {
  if (!appSchemaExists() || getMigrationCount() > 0) {
    return;
  }

  const journalFile = Bun.file("./drizzle/meta/_journal.json");
  const journal = (await journalFile.json()) as MigrationJournal;

  sqlite.exec(`
    create table if not exists "__drizzle_migrations" (
      id integer primary key autoincrement not null,
      hash text not null,
      created_at numeric not null
    )
  `);

  for (const entry of journal.entries) {
    const hash = await hashMigrationFile(entry.tag);

    sqlite
      .query("insert into __drizzle_migrations (hash, created_at) values (?, ?)")
      .run(hash, entry.when);
  }

  console.log("Bootstrapped Drizzle migration history for an existing SQLite schema.");
};

await seedBaselineMigrations();

migrate(db, {
  migrationsFolder: "./drizzle",
});

console.log("Database migrations applied.");
