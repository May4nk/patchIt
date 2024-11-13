import { listAll, findOne } from "../../utils/queriesutils.js";

//types
import { usertype } from "./types/usertypes.js";
import { commenttype } from "./types/commenttypes.js";
import { filtersorttype } from "../../utils/types.js";
import { posttagstype } from "./types/posttagstypes.js";
import { communitytype } from "./types/communitiestypes.js";
import { posttype, postfiltertype } from "./types/posttypes.js";

export const postResolvers = {
  Query: {
    listPosts: async (
      _: undefined,
      filter: filtersorttype<postfiltertype>
    ): Promise<posttype[]> => {
      try {
        const allPosts: posttype[] = await listAll<posttype, postfiltertype>("posts", filter);

        return allPosts;
      } catch(err) {
        throw err;
      }
    },
    post: async (_: undefined, { id }: { id: number }): Promise<posttype> => {
      try {
        const postById: posttype = await findOne<posttype, { id: number }>("posts", { "id": id });

        if(!postById) throw new Error(`Post not found with id: ${id}`);

        return postById;
      } catch (err) {
        throw err;
      }
    },
  },
  Post: {
    owner: async({ owner }: { owner: number }): Promise<usertype> => {
      try {
        const userById: usertype = await findOne<usertype, { id: number }>("users", { "id": owner});

        return userById;
      } catch (err) {
        throw err;
      }
    },
    community_id: async({ community_id }: { community_id: number }): Promise<communitytype> => {
      try {
        const postsCommunity: communitytype = await findOne<
          communitytype,
          { id: number }
        >("communities", { "id": community_id });

        return postsCommunity;
      } catch (err) {
        throw err;
      }
    },
    tags: async({ id }: { id: number }): Promise<posttagstype[]> => {
      try {
        const postTags: posttagstype[] = await listAll<
          posttagstype,
          { post_id: number }
        >("posts_tags_relation", { filter: { "post_id": id }});

        return postTags;
      } catch(err) {
        throw err;
      }
    },
    comments: async({ id }: { id: number }): Promise<commenttype[]> => {
      try {
        const postComments: commenttype[] = await listAll<
          commenttype,
          { post_id: number }
        >("comments", { filter: { "post_id": id }});
        
        return postComments;
      } catch(err) {
        throw err;
      }
    }
  }
}

