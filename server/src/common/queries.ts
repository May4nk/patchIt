import db from "../db.js";

interface sorttype {
  column?: string;
  nulls?: string;
  order?: string;
}

export interface filtersorttype<K> {
  filter?: K;
  sort?: sorttype[];
  limit?: number;
}

export async function listAll<T, K>(tableName: string, filtercolumns?: filtersorttype<K>): Promise<T[]> {
  if(filtercolumns) {
    switch(true) {
      case("filter" in filtercolumns && "sort" in filtercolumns && "limit" in filtercolumns):
        
        const listFilteredSortedLimitedAll: T[] = await db(tableName)
          .select("*")
          .where({ ...filtercolumns.filter })
          .orderBy([ ...<[]>filtercolumns.sort ])
          .limit(filtercolumns?.limit!);

        return listFilteredSortedLimitedAll;

      case("filter" in filtercolumns && "limit" in filtercolumns):
        
        const listFilteredLimitedAll: T[] = await db(tableName)
          .select("*")
          .where({ ...filtercolumns.filter })
          .limit(filtercolumns?.limit!);

        return listFilteredLimitedAll;
      case("filter" in filtercolumns && "sort" in filtercolumns):
        
        const listFilteredSortedAll: T[] = await db(tableName)
          .select("*")
          .where({ ...filtercolumns.filter })
          .orderBy([ ...<[]>filtercolumns.sort ]);

        return listFilteredSortedAll;

      case("filter" in filtercolumns):
        
        const listFilteredAll: T[] = await db(tableName)
          .select("*")
          .where({ ...filtercolumns.filter });

        return listFilteredAll;
      
      case("sort" in filtercolumns):
        
        const listSortedAll: T[] = await db(tableName)
          .select("*")
          .orderBy([ ...<[]>filtercolumns.sort ]);

        return listSortedAll;
      
      case("limit" in filtercolumns):

        const listLimitedAll: T[] = await db(tableName)
          .select("*")
          .limit(filtercolumns?.limit!);

        return listLimitedAll;

    }     
  }
  
  const listAllQuery: T[] = await db(tableName) 
    .select("*");

  return listAllQuery;
}        

export async function findOne<T, L extends object>(tablename: string, filtercolumn: L): Promise<T> {
  const findOneQuery: T = await db(tablename)
    .select("*")
    .where(filtercolumn)
    .first();
 
  return findOneQuery;
}



