// place files you want to import through the `$lib` alias in this folder.
import { drizzle } from 'drizzle-orm/node-postgres';
import {migrate } from 'drizzle-orm/node-postgres/migrator';

const db = drizzle({ connection: process.env.DATABASE_URL });

async function init() {
    await migrate(db, {
        migrationsFolder: './drizzle',
    });
}

init().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});