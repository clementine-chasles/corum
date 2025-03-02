import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';

export async function clearDatabase(): Promise<void> {
  const db = drizzle(process.env.DATABASE_URL!);
  const query = sql<string>`SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    `;

  const tables = await db.execute(query);

  await Promise.all(
    tables.rows.map(async (table) => {
      const truncateQuery = sql.raw(`TRUNCATE TABLE ${table.table_name} CASCADE;`);
      await db.execute(truncateQuery);
    }),
  );
}
