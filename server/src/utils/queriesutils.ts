import db from "../db.js";

//types
import { filtersorttype } from "./types.js";

export async function listAll<T, K>(
  tableName: string,
  filtercolumns?: filtersorttype<K>
): Promise<T[]> {
  const listAllQuery = db(tableName).select("*");

  if (filtercolumns) {
    if ("filter" in filtercolumns) {
      const filter = filtercolumns.filter;

      for (const option in filter) {
        if (Array.isArray(filter[option])) {
          listAllQuery.whereIn(option as string, filter[option] as any);
        } else {
          listAllQuery.where({ [option]: filter[option] });
        }
      }
    }

    if ("sort" in filtercolumns) {
      listAllQuery.orderBy([...(<[]>filtercolumns.sort)]);
    }

    if ("limit" in filtercolumns && filtercolumns?.limit !== undefined) {
      listAllQuery.limit(filtercolumns?.limit);
    }
  }

  return await listAllQuery;
}

export async function findOne<T, L extends object>(
  tablename: string,
  filtercolumn: L
): Promise<T> {
  const findOneQuery: T = await db(tablename)
    .select("*")
    .where(filtercolumn)
    .first();

  return findOneQuery;
}
