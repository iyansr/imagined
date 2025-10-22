import { getCloudflareContext } from '@opennextjs/cloudflare';
import { TRPCError } from '@trpc/server';
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

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

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

  myPrompts: protectedProcedure
    .input(
      z.object({
        q: z.string().optional().default(''),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(50).default(PAGE_SIZE),
      })
    )
    .query(async ({ ctx, input }) => {
      const { q, cursor, limit } = input;
      const { db, session } = ctx;

      const userId = session.user.id;

      // biome-ignore lint/correctness/noUnusedVariables: <ignored>
      const { userId: ignored, ...rest } = getTableColumns(prompt);

      const whereConditions = [];

      // Add user ID condition
      whereConditions.push(eq(prompt.userId, userId));

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

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, 'Prompt ID is required'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const { db, session } = ctx;

      // First, get the prompt to check ownership and get the thumbnail URL
      const [existingPrompt] = await db
        .select()
        .from(prompt)
        .where(eq(prompt.id, id));

      if (!existingPrompt) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Prompt not found',
        });
      }

      // Check if the user owns this prompt
      if (existingPrompt.userId !== session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You can only delete your own prompts',
        });
      }

      try {
        // Delete the file from R2 bucket if it exists
        if (existingPrompt.thumbnailUrl) {
          const ctx = await getCloudflareContext({ async: true });

          // Extract the key from the URL
          // For development: http://localhost:3200/api/r2/{key}
          // For production: https://cdn-imagined.iyansr.id/{key}
          const urlParts = existingPrompt.thumbnailUrl.split('/');
          const key = urlParts[urlParts.length - 1];

          if (key && key !== '') {
            try {
              await ctx.env.IMAGINED_BUCKET.delete(key);
            } catch (error) {
              console.error('Failed to delete file from R2:', error);
              // Continue with database deletion even if file deletion fails
            }
          }
        }

        // Delete the prompt from the database
        await db.delete(prompt).where(eq(prompt.id, id));

        return {
          success: true,
          message: 'Prompt deleted successfully',
        };
      } catch (error) {
        console.error('Error deleting prompt:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete prompt',
        });
      }
    }),
});
