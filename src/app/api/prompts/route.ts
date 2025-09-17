import {
  arrayContains,
  count,
  desc,
  getTableColumns,
  isNull,
  like,
  or,
} from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { getDb } from '@/lib/db/database';
import { prompt } from '@/lib/db/schema';

const PAGE_SIZE = 12; // Number of prompts per page

export async function POST(req: Request) {
  const {
    q,
    page = 1,
    limit = PAGE_SIZE,
  } = (await req.json()) as {
    q: string;
    page?: number;
    limit?: number;
  };

  const db = getDb();

  // biome-ignore lint/correctness/noUnusedVariables: <ignored>
  const { userId, ...rest } = getTableColumns(prompt);

  const prompts = await db
    .select(rest)
    .from(prompt)
    .where(
      q
        ? or(
            like(prompt.prompt, `%${q}%`),
            like(prompt.title, `%${q}%`),
            isNull(prompt.tags) ? undefined : arrayContains(prompt.tags, [q])
          )
        : undefined
    )
    .orderBy(desc(prompt.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  const total = await db
    .select({
      count: count(),
    })
    .from(prompt)
    .where(
      q
        ? or(
            like(prompt.prompt, `%${q}%`),
            like(prompt.title, `%${q}%`),
            isNull(prompt.tags) ? undefined : arrayContains(prompt.tags, [q])
          )
        : undefined
    );

  const totalPage = Math.ceil(total[0].count / limit);

  return NextResponse.json({
    prompts,
    total: total[0].count,
    totalPage,
  });
}
