import { listAll, findOne } from "../../utils/queriesutils.js";
//types
import { usertype } from "./types/usertypes.js";
import { filtersorttype } from "../../utils/types.js";
import { communitytype } from "./types/communitiestypes.js";
import { userscommunitytype, userscommunityfiltertype } from "./types/userscommunitytypes.js";

export const userscommunityResolvers = {
  Query: {
    listUsersCommunity: async (
      _: undefined,
      filter?: filtersorttype<userscommunityfiltertype>
    ): Promise<userscommunitytype[]> => {
      try {
        const allUsersCommunity: userscommunitytype[] = await listAll<
          userscommunitytype,
          userscommunityfiltertype
        >("user_community_relation", filter);

        return allUsersCommunity;
      } catch (err) {
        throw err;
      }
    },
    userCommunity: async (_: undefined, { id }: { id: number }): Promise<userscommunitytype> => {
      try {
        const usercommunityById: userscommunitytype = await findOne<
          userscommunitytype,
          { id: number }
        >("user_community_relation", { id: id });

        if (!usercommunityById)
          throw new Error(`User not associated with community`);

        return usercommunityById;
      } catch (err) {
        throw err;
      }
    },
  },
  UserCommunity: {
    user_id: async ({ user_id }: { user_id: number }): Promise<usertype> => {
      try {
        const userById: usertype = await findOne<usertype, { id: number }>(
          "users",
          { id: user_id }
        );

        return userById;
      } catch (err) {
        throw err;
      }
    },
    community_id: async ({ community_id } : { community_id: number }): Promise<communitytype> => {
      try {
        const communityById: communitytype = await findOne<
          communitytype,
          { id: number }
        >("communities", { id: community_id });

        return communityById;
      } catch (err) {
        throw err;
      }
    },
  },
};
