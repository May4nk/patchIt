import { gql } from "@apollo/client";

export const GETPOSTS = gql`
query ListPosts($filter: PostfilterInput, $sort: [SortInput], $limit: Int) {
  listPosts(filter: $filter, sort: $sort, limit: $limit) {
    id
    content
    type
    title
    likes
    status
    created_at
    comments {
      id
    }
    community_id {
      communityname
    }    
    owner {
      username
    }
  }
}
`;

export const GETUSERS = gql`
query ListUsers($sort: [SortInput], $filter: UsersfilterInput, $limit: Int) {
  listUsers(sort: $sort, filter: $filter, limit: $limit) {
    id
    email
    username
    about
    profile_pic
    dob
    status
    role {      
      role
    }
    created_at
  }
}
`;

export const GETCOMMUNITIES = gql`
query ListCommunities($limit: Int, $sort: [SortInput], $filter: CommunitiesfilterInput) {
  listCommunities(limit: $limit, sort: $sort, filter: $filter) {
    id
    communityname
    description
    privacy
    status
    profile_pic
    theme
    created_at
    users {
      id
    }
    owner {
      username
    }
  }
}
`;

export const GETCHATS = gql `
query ListChatrooms($limit: Int, $sort: [SortInput], $filter: ChatroomsfilterInput) {
  listChatrooms(limit: $limit, sort: $sort, filter: $filter) {
    id
    room_code
    created_at
  }
}
`;

export const GETROLES = gql `
query ListRoles($filter: RolesfilterInput, $sort: [SortInput], $limit: Int) {
  listRoles(filter: $filter, sort: $sort, limit: $limit) {
    id
    role
    created_at
  }
}
`;

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