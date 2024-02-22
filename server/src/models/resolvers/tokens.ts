import { listAll, findOne, filtersorttype } from "../../common/queries.js";
import { tokentype, tokenfiltertype } from "./types/tokentypes.js";
import { usertype } from "./types/usertypes.js";

export const tokenResolvers = {
  Query: {
    listTokens: async (parent: undefined, filter?: filtersorttype<tokenfiltertype>): Promise<tokentype[]> => {
      try { 
        const allTokens: tokentype[] = await listAll<tokentype, tokenfiltertype>("tokens", filter);
        return allTokens;
      } catch(err) {
        throw err;
      }
    },
    token: async (parent: undefined, { userId }: { userId: number }): Promise<tokentype> => {
      try {
        const tokenByUser: tokentype = await findOne<tokentype, { user_id: number }>("tokens", { "user_id": userId });

        if(!tokenByUser ) throw new Error(`Token not found with userId: ${userId}`);

        return tokenByUser;
      } catch(err) {
        throw err;
     }
    }
  },
  Token: {
    user_id: async({ user_id }: { user_id: number }): Promise<usertype> => {
      try {
        const user: usertype = await findOne<usertype, { id: number }>("users", { "id": user_id });
        return user;
      } catch (err) {
        throw err;
      }
    },
  },
}

