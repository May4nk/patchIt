import db from "../../db.js";
import { findOne } from "../../utils/queriesutils.js";

//types
import { remuserfollowingtype, userfollowingtype } from "./types/userfollowingmutetypes.js";

export const userfollowingMutations = {
  Mutation: {
    insertUserFollowing: async (
      _: undefined,
      { data }: { data: userfollowingtype }
    ): Promise<userfollowingtype> => {
      try {
        const [createUserFollowing]: userfollowingtype[] = await db("user_user_relation")
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
    ): Promise<{ id: number }> => {
      try {
        const foundUserFollowing: userfollowingtype = await findOne<
          userfollowingtype,
          { follower: number; following: number }
        >("user_user_relation", {
          follower: data.follower,
          following: data.following,
        });

        if (!foundUserFollowing)
          throw new Error("User not following yet...");

        const [deleteUserFollowing]: { id: number }[] = await db("user_user_relation")
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
