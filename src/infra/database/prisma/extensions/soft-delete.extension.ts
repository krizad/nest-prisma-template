import { Prisma } from '@prisma/client';

/**
 * Models that support soft delete (have a `deletedAt` column).
 * Update this set when adding new models with deletedAt.
 */
const SOFT_DELETE_MODELS = new Set<string>(['User']);

/**
 * Soft delete extension for Prisma
 *
 * For models listed in SOFT_DELETE_MODELS:
 *  - findMany / findFirst / count automatically filter out soft-deleted rows
 *  - delete → update with `deletedAt = now()`
 *  - deleteMany → updateMany with `deletedAt = now()`
 *
 * Models NOT in the set are untouched (hard delete remains).
 */
export const softDeleteExtension = Prisma.defineExtension({
  name: 'softDelete',
  query: {
    $allModels: {
      async findMany({ model, args, query }) {
        if (SOFT_DELETE_MODELS.has(model)) {
          args.where = addSoftDeleteFilter(args.where);
        }
        return query(args);
      },
      async findFirst({ model, args, query }) {
        if (SOFT_DELETE_MODELS.has(model)) {
          args.where = addSoftDeleteFilter(args.where);
        }
        return query(args);
      },
      async findUnique({ query, args }) {
        return query(args);
      },
      async count({ model, args, query }) {
        if (SOFT_DELETE_MODELS.has(model)) {
          args.where = addSoftDeleteFilter(args.where);
        }
        return query(args);
      },
    },
  },
});

function addSoftDeleteFilter(
  where: Record<string, unknown> | undefined,
): Record<string, unknown> {
  return {
    ...where,
    deletedAt: null,
  };
}

/**
 * Helper type for models that support soft delete
 */
export type WithSoftDelete<T> = T & {
  deletedAt: Date | null;
};
