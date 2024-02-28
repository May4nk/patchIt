import { gql } from "@apollo/client";

export const GETPOST = gql`
query Post($postId: Int!) {
  post(id: $postId) {
    id
    title
    type
    status
    content
    likes
    created_at
    comments {
      id    
      comment
      created_at      
      parent_id {
        id
        comment
        created_at
        user_id {
          id
          username
          profile_pic
        }
      }
      user_id {
        id
        username
        profile_pic
      }
    }
    community_id {
      id
      communityname
    }    
    owner {
      id
      profile_pic
      username
    }
    tags {
      tag_id {
        name
      }
    }  
  }
}
`;

export const SUBSCRIBETOMORECOMMENT = gql`
subscription NewComment {
  newComment {
    id    
    comment
    created_at      
    parent_id {
      id
      comment
      created_at
      user_id {
        id
        username
        profile_pic
      }
    }
    user_id {
      id
      username
      profile_pic
    }
  }
}
`;

export const GETUSERALLREACTIONS = gql`
query ListUsers($filter: UsersfilterInput) {
  listUsers(filter: $filter) {
    id
    reactedposts {
      reaction
      post_id {
        id
      }
    }
    savedposts {
      saved
      pinned
      post_id {
        id
      }
    }
  }
}
`;