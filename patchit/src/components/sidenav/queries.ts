import { gql } from "@apollo/client";

export const GETCATEGORIES = gql `
query ListCategories($sort: [SortInput], $filter: CategoriesfilterInput, $limit: Int) {
  listCategories(sort: $sort, filter: $filter, limit: $limit) {
    id
    categoryname
    categoryicon
    created_at
  }
}
`;

export const GETCOMMUNITIES = gql`
query ListCommunities($limit: Int, $sort: [SortInput], $filter: CommunitiesfilterInput) {
  listCommunities(limit: $limit, sort: $sort, filter: $filter) {
    id
    communityname    
    profile_pic      
  }
}
`;