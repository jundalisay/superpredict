import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

function getClient() {
	const url = process.env.DATABASE_URL ?? 'file:./local.db';
	const authToken = process.env.DATABASE_AUTH_TOKEN;
	return createClient({ url, authToken });
}

export function getDb() {
	return drizzle(getClient(), { schema });
}
