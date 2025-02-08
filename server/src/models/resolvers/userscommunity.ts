import { listAll, findOne } from "../../utils/common/queriesutils.js";
//types
import { usertype } from "./types/usertypes.js";
import { filtersorttype } from "../../utils/common/types.js";
import { communitytype } from "./types/communitiestypes.js";
import {
  userscommunitytype,
  userscommunityfiltertype,
} from "./types/userscommunitytypes.js";

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
    userCommunity: async (
      _: undefined,
      { id }: { id: string }
    ): Promise<userscommunitytype> => {
      try {
        const usercommunityById: userscommunitytype = await findOne<
          userscommunitytype,
          { id: string }
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
    user_id: async ({ user_id }: { user_id: string }): Promise<usertype> => {
      try {
        const userById: usertype = await findOne<usertype, { id: string }>(
          "users",
          { id: user_id }
        );

        return userById;
      } catch (err) {
        throw err;
      }
    },
    community_id: async ({
      community_id,
    }: {
      community_id: string;
    }): Promise<communitytype> => {
      try {
        const communityById: communitytype = await findOne<
          communitytype,
          { id: string }
        >("communities", { id: community_id });

        return communityById;
      } catch (err) {
        throw err;
      }
    },
  },
};
