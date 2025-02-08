import { listAll, findOne } from "../../utils/common/queriesutils.js";
//types
import { usertype } from "./types/usertypes.js";
import { posttype } from "./types/posttypes.js";
import { filtersorttype } from "../../utils/common/types.js";
import { categorytype } from "./types/categorytypes.js";
import { userscommunitytype } from "./types/userscommunitytypes.js";
import { communitypreferencetype } from "./types/communitypreferencetypes.js";
import {
  communitytype,
  communityfiltertype,
} from "./types/communitiestypes.js";

export const communityResolvers = {
  Query: {
    listCommunities: async (
      _: undefined,
      filter?: filtersorttype<communityfiltertype>
    ): Promise<communitytype[]> => {
      try {
        const allCommunities: communitytype[] = await listAll<
          communitytype,
          communityfiltertype
        >("communities", filter);

        return allCommunities;
      } catch (err) {
        throw err;
      }
    },
    community: async (
      _: undefined,
      { communityname }: { communityname: string }
    ): Promise<communitytype> => {
      try {
        const communityByName: communitytype = await findOne<
          communitytype,
          { name: string }
        >("communities", { name: communityname });

        if (!communityByName) {
          throw new Error(`Community not found with name: ${communityname}`);
        }

        return communityByName;
      } catch (err) {
        throw err;
      }
    },
  },
  Community: {
    owner: async ({ owner }: { owner: string }): Promise<usertype> => {
      try {
        const communityOwner: usertype = await findOne<
          usertype,
          { id: string }
        >("users", { id: owner });

        return communityOwner;
      } catch (err) {
        throw err;
      }
    },
    category: async ({
      category,
    }: {
      category: string;
    }): Promise<categorytype> => {
      try {
        const communityCategory: categorytype = await findOne<
          categorytype,
          { categoryname: string }
        >("categories", { categoryname: category });

        return communityCategory;
      } catch (err) {
        throw err;
      }
    },
    users: async ({ id }: { id: string }): Promise<userscommunitytype[]> => {
      try {
        const allCommunityUsers: userscommunitytype[] = await listAll<
          userscommunitytype,
          { community_id: string }
        >("user_community_relation", { filter: { community_id: id } });

        return allCommunityUsers;
      } catch (err) {
        throw err;
      }
    },
    posts: async ({ id }: { id: string }): Promise<posttype[]> => {
      try {
        const allCommunityPosts: posttype[] = await listAll<
          posttype,
          { community_id: string }
        >("posts", { filter: { community_id: id } });

        return allCommunityPosts;
      } catch (err) {
        throw err;
      }
    },
    settings: async ({
      name,
    }: {
      name: string;
    }): Promise<communitypreferencetype> => {
      try {
        const communitySettings: communitypreferencetype = await findOne<
          communitypreferencetype,
          { community_name: string }
        >("community_preferences", { community_name: name });

        return communitySettings;
      } catch (err) {
        throw err;
      }
    },
  },
};
