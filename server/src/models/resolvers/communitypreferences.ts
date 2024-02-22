import { listAll, findOne, filtersorttype } from "../../common/queries.js";
import { communitytype, communityfiltertype } from "./types/communitiestypes.js";
import { communitypreferencetype, communitypreferencefiltertype } from "./types/communitypreferencetypes.js";

export const communitypreferenceResolvers = {
  Query: {
    listCommunityPreferences: async (parent: undefined, filter?: filtersorttype<communitypreferencefiltertype>): Promise<communitypreferencetype[]> => {
      try {
        const allcommunitypreferences: communitypreferencetype[] = await listAll<communitypreferencetype, communitypreferencefiltertype>("community_preferences", filter );
        return allcommunitypreferences;
      } catch(err) {
        throw err;
      }
    },
    communitypreference: async ( parent: undefined, { communityName }: { communityName: string } ): Promise<communitypreferencetype> => {
      try {
        const communitypreferenceByName: communitypreferencetype = await findOne<communitypreferencetype, { community_name: string }>("community_preferences", { "community_name" : communityName });
        if(!communitypreferenceByName) throw new Error(`No setting found for Community with Name: ${ communityName }`);

        return communitypreferenceByName;
      } catch(err) {
        throw err;
      }
    }
  },
  CommunityPreferences: {
    community_name: async({ community_name }: { community_name: string }): Promise<communitytype> => {
      try{ 
        const communityByName: communitytype = await findOne<communitytype, { communityname: string }>("communities", { "communityname": community_name });
        return communityByName;
      } catch(err) {
        throw err;
      }
    }
  }
}

