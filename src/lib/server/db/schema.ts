import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const us = sqliteTable('us', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	date: text('date').notNull(),
	worker: real('worker').notNull().default(0),
	warrior: real('warrior').notNull().default(0),
	thinker: real('thinker').notNull().default(0),
	trader: real('trader').notNull().default(0),
	articleCount: integer('article_count').notNull().default(0),
	createdAt: text('created_at').notNull()
});

export const ph = sqliteTable('ph', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	date: text('date').notNull(),
	worker: real('worker').notNull().default(0),
	warrior: real('warrior').notNull().default(0),
	thinker: real('thinker').notNull().default(0),
	trader: real('trader').notNull().default(0),
	articleCount: integer('article_count').notNull().default(0),
	createdAt: text('created_at').notNull()
});

export const articleLog = sqliteTable('article_log', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	country: text('country').notNull(),
	date: text('date').notNull(),
	headline: text('headline').notNull(),
	category: text('category').notNull(),
	score: real('score').notNull(),
	source: text('source').notNull(),
	createdAt: text('created_at').notNull()
});

export type Us = typeof us.$inferSelect;
export type Ph = typeof ph.$inferSelect;
export type ArticleLog = typeof articleLog.$inferSelect;
