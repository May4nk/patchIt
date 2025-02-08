import db from "../../db.js";
import { findOne } from "../../utils/common/queriesutils.js";

//types
import {
  userfollowingtype,
  remuserfollowingtype,
  rawuserfollowingtype,
  userfollowingfiltertype,
} from "../resolvers/types/userfollowingtypes.js";
import { IDSTYPE } from "../../utils/common/types.js";

export const userfollowingMutations = {
  Mutation: {
    insertUserFollowing: async (
      _: undefined,
      { data }: { data: rawuserfollowingtype }
    ): Promise<rawuserfollowingtype> => {
      try {
        const [createUserFollowing]: rawuserfollowingtype[] = await db(
          "user_user_relation"
        )
          .insert({ ...data })
          .returning("*");

        return createUserFollowing;
      } catch (err) {
        throw err;
      }
    },
    removeUserFollowing: async (
      _: undefined,
      { data }: { data: remuserfollowingtype }
    ): Promise<IDSTYPE> => {
      try {
        const foundUserFollowing: userfollowingtype = await findOne<
          userfollowingtype,
          userfollowingfiltertype
        >("user_user_relation", {
          follower: data.follower,
          following: data.following,
        });

        if (!foundUserFollowing) throw new Error("User not following yet...");

        const [deleteUserFollowing]: IDSTYPE[] = await db("user_user_relation")
          .where("id", foundUserFollowing.id)
          .del()
          .returning("id");

        return deleteUserFollowing;
      } catch (err) {
        throw err;
      }
    },
  },
};
