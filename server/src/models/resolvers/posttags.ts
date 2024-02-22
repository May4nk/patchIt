import { listAll, findOne, filtersorttype } from "../../common/queries.js";
import { posttagstype, posttagsfiltertype } from "./types/posttagstypes.js";
import { tagtype } from "./types/tagtypes.js";
import { posttype } from "./types/posttypes.js";

export const posttagsResolvers = {
  Query: {
    listPostTags: async (parent: undefined, filter: filtersorttype<posttagsfiltertype>): Promise<posttagstype[]> => {
      try { 
        const allPostTags: posttagstype[] = await listAll<posttagstype, posttagsfiltertype>("posts_tags_relation", filter);
        return allPostTags;
      } catch(err) {
        throw err;
      }
    },
    postTag: async (parent: undefined, { id }: { id: number }): Promise<posttagstype> => {
      try {
        const postTagById: posttagstype = await findOne<posttagstype, { id: number }>("posts_tags_relation", { "id": id });

        if(!postTagById) throw new Error(`Post and tag relation not found with id: ${ id }`);

        return postTagById;
      } catch(err) {
        throw err;
     }
    },
  },
  PostTags: {
    tag_id: async ({ tag_id }: { tag_id: number }): Promise<tagtype> => {
      try { 
        const tagById: tagtype = await findOne<tagtype, { id: number }>("tags", { id: tag_id });
        return tagById;
      } catch(err) {
        throw err;
      }
    },
    post_id: async ({ post_id }: { post_id: number }): Promise<posttype> => {
      try { 
        const postById: posttype = await findOne<posttype, { id: number }>("posts", { id: post_id });
        return postById;
      } catch(err) {
        throw err;
      }
    }
  }
}

