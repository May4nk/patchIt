import db from "../../db.js";

//utils
import { findOne } from "../../utils/common/queriesutils.js";
import { generatePresignedUrls } from "../../services/s3.js";

//types
import { posttype } from "../resolvers/types/posttypes.js";
import { signedurltype } from "../../services/types.js";
import { signedurldata } from "./types/postmutetypes.js";
import { IDSTYPE, loggedusertype } from "../../utils/common/types.js";
import { fromCache } from "../../services/redis.js";

export const postMutations = {
  Mutation: {
    getSignedUrl: async (
      _: undefined,
      { data }: signedurldata
    ): Promise<signedurltype[]> => {
      try {
        const signedUrls: signedurltype[] = await generatePresignedUrls({
          files: data?.files,
          req: data?.req,
          postId: data?.postId,
          userId: data?.userId,
        });

        return signedUrls;
      } catch (err) {
        throw err;
      }
    },
    insertPost: async (
      _: undefined,
      { data }: { data: posttype },
      { user }: { user: loggedusertype }
    ): Promise<posttype> => {
      if (!user) throw new Error("user not authenticated...");

      try {
        const [newPost]: posttype[] = await db("posts")
          .insert(data)
          .returning("*");

        return newPost;
      } catch (err) {
        console.log(err);
        throw Error("Failed to insert post");
      }
    },
    updatePost: async (
      _: undefined,
      { data }: { data: posttype },
      { user }: { user: loggedusertype }
    ): Promise<posttype> => {
      if (!user) throw new Error("user not authenticated");

      const postId: string = data.id;
      const foundPost: posttype = await findOne<posttype, IDSTYPE>("posts", {
        id: postId,
      });

      if (!foundPost) {
        throw new Error(`Post not found with ${postId}`);
      }

      try {
        const [updatedPost]: posttype[] = await db("posts")
          .where("id", foundPost.id)
          .update(data)
          .returning("*");

        return updatedPost;
      } catch (err) {
        throw new Error(`Post update failed...`);
      }
    },
    removePost: async (
      _: undefined,
      { data }: { data: IDSTYPE }
    ): Promise<IDSTYPE> => {
      try {
        const foundPost: posttype = await findOne<posttype, IDSTYPE>("posts", {
          id: data.id,
        });

        if (!foundPost) throw new Error("Post not found...");

        const [deletePost]: IDSTYPE[] = await db("posts")
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
