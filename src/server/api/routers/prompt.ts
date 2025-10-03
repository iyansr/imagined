import {
  and,
  arrayContains,
  desc,
  eq,
  getTableColumns,
  isNull,
  like,
  lt,
  or,
} from 'drizzle-orm';
import { z } from 'zod';

import { prompt } from '@/lib/db/schema';

import { createTRPCRouter, publicProcedure } from '../trpc';

const PAGE_SIZE = 12;

export const promptRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        q: z.string().optional().default(''),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(50).default(PAGE_SIZE),
      })
    )
    .query(async ({ ctx, input }) => {
      const { q, cursor, limit } = input;
      const { db } = ctx;

      // biome-ignore lint/correctness/noUnusedVariables: <ignored>
      const { userId, ...rest } = getTableColumns(prompt);

      const whereConditions = [];

      // Add search conditions
      if (q) {
        whereConditions.push(
          or(
            like(prompt.title, `%${q}%`),
            isNull(prompt.tags) ? undefined : arrayContains(prompt.tags, [q])
          )
        );
      }

      // Add cursor condition for pagination
      if (cursor) {
        whereConditions.push(lt(prompt.id, cursor));
      }

      const prompts = await db
        .select(rest)
        .from(prompt)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(desc(prompt.createdAt))
        .limit(limit + 1);

      const hasNextPage = prompts.length > limit;
      const items = hasNextPage ? prompts.slice(0, -1) : prompts;
      const nextCursor = hasNextPage ? items[items.length - 1]?.id : undefined;

      return {
        prompts: items,
        nextCursor,
      };
    }),

  detail: publicProcedure
    .input(
      z.object({
        id: z.string().min(1, 'Prompt ID is required'),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const { db } = ctx;

      const [promptDetail] = await db
        .select()
        .from(prompt)
        .where(eq(prompt.id, id));

      return {
        success: true,
        data: promptDetail,
      };
    }),
});
