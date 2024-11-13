import { listAll, findOne } from "../../utils/queriesutils.js";

//types
import { usertype } from "./types/usertypes.js";
import { filtersorttype } from "../../utils/types.js";
import { tokentype, tokenfiltertype } from "./types/tokentypes.js";

export const tokenResolvers = {
  Query: {
    listTokens: async (
      _: undefined,
      filter?: filtersorttype<tokenfiltertype>
    ): Promise<tokentype[]> => {
      try {
        const allTokens: tokentype[] = await listAll<
          tokentype,
          tokenfiltertype
        >("tokens", filter);
        
        return allTokens;
      } catch (err) {
        throw err;
      }
    },
    token: async (_: undefined, { userId }: { userId: number }): Promise<tokentype> => {
      try {
        const tokenByUser: tokentype = await findOne<
          tokentype,
          { user_id: number }
        >("tokens", { user_id: userId });

        if (!tokenByUser)
          throw new Error(`Token not found with userId: ${userId}`);

        return tokenByUser;
      } catch (err) {
        throw err;
      }
    },
  },
  Token: {
    user_id: async ({ user_id }: { user_id: number }): Promise<usertype> => {
      try {
        const user: usertype = await findOne<
          usertype,
          { id: number }
        >("users", { id: user_id });

        return user;
      } catch (err) {
        throw err;
      }
    },
  },
};
