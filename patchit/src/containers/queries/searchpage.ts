import { gql } from "@apollo/client";

export const GETUSERS = gql`
query ListUsers($filter: UsersfilterInput) {
  listUsers(filter: $filter) {
    id
    email
    username
    about
    profile_pic
    status
    posts { id }
  }
}
`;

export const GETCOMMUNITIES = gql`
query ListCommunities($filter: CommunitiesfilterInput) {
  listCommunities(filter: $filter) {
    id
    communityname
    profile_pic
    privacy
    description
    status
    theme
    users { id }
    posts { id }
  }
}
`; 

export const GETALLCOMMENTS = gql`
query ListComments($filter: CommentfilterInput) {
  listComments(filter: $filter) {
    id
    comment
    created_at
    user_id {
      username
    }    
    parent_id {
      id
      comment
      created_at
      user_id {
        username
      }    
    }
    post_id {
      id
      title
      community_id {
        communityname
      }
    }  
  }
}
`;
