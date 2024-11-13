import { listAll, findOne } from "../../utils/queriesutils.js";

//types
import { usertype } from "./types/usertypes.js";
import { filtersorttype } from "../../utils/types.js";
import { userfollowingfiltertype, userfollowingtype } from "./types/userfollowingtypes.js";

export const userfollowingResolvers = {
  Query: {
    listUserFollowing: async (
      _: undefined,
      filter?: filtersorttype<userfollowingfiltertype>
    ): Promise<userfollowingtype[]> => {
      try {
        const allUserFollowing: userfollowingtype[] = await listAll<
          userfollowingtype,
          userfollowingfiltertype
        >("user_user_relation", filter);

        return allUserFollowing;
      } catch (err) {
        throw err;
      }
    },
    userFollowing: async (_: undefined, { id }: { id: number }): Promise<userfollowingtype> => {
      try {
        const userFollowingById: userfollowingtype = await findOne<
          userfollowingtype,
          { id: number }
        >("user_user_relation", { id: id });

        if (!userFollowingById)
          throw new Error(`User not following`);

        return userFollowingById;
      } catch (err) {
        throw err;
      }
    },
  },
  UserFollowing: {
    follower: async ({ follower }: { follower: number }): Promise<usertype> => {
      try {
        const userById: usertype = await findOne<
          usertype,
          { id: number }
        >("users", { "id": follower });

        return userById;
      } catch (err) {
        throw err;
      }
    },
    following: async ({ following }: { following: number }): Promise<usertype> => {
      try {
        const userById: usertype = await findOne<
          usertype,
          { id: number }
        >("users", { "id": following });
        
        return userById;
      } catch (err) {
        throw err;
      }
    },
  },
};
