import db from "../../db.js";
import { findOne } from "../../utils/queriesutils.js";

//types
import { posttype } from "../resolvers/types/posttypes.js";
import { usertype } from "../resolvers/types/usertypes.js";
import {
  postdatatype,
  rempostdatatype,
  rposttype,
} from "./types/postmutetypes.js";

export const postMutations = {
  Mutation: {
    upsertPost: async (
      _: undefined,
      { data }: postdatatype,
      { user }: { user: usertype }
    ): Promise<posttype> => {
      try {
        if (!user) throw new Error("user not authenticated");

        const postID: number = data.id;

        if (postID) {
          const foundPost: posttype = await findOne<posttype, { id: number }>(
            "posts",
            { id: postID }
          );

          if (!foundPost) throw new Error(`Post not found...`);

          const [updatePost]: posttype[] = await db("posts")
            .where("id", foundPost.id)
            .update(data)
            .returning("id");

          return updatePost;
        } else {
          const [createPost]: posttype[] = await db("posts")
            .insert(data)
            .returning("*");

          return createPost;
        }
      } catch (err) {
        throw err;
      }
    },
    removePost: async (_: undefined, { data }: rempostdatatype ): Promise<rposttype> => {
      try {
        const foundPost: posttype = await findOne<posttype, { id: number }>(
          "posts",
          { id: data.id }
        );

        if (!foundPost) throw new Error("Post not found...");

        const [deletePost]: rposttype[] = await db("posts")
          .where("id", data.id)
          .del()
          .returning("id");

        return deletePost;
      } catch (err) {
        throw err;
      }
    },
  },
};
