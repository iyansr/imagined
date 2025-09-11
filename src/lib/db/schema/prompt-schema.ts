import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { user } from './auth-schema';

export const prompt = pgTable('prompt', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  prompt: text('prompt').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  tags: text('tags').array(),
  style: text('style'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
