import { gql } from "@apollo/client";
import { USER_ID_USERNAME } from "./user";

const CORE_COMMENT_FIELDS = gql`
  fragment CoreCommentFields on Comment {
    id
    text
    likes
    created_at
    parent_id {
      id
      text
      status
    }
    user_id {
      ...userIdNameFields
      profile_pic
      status
    }
  }
  ${USER_ID_USERNAME}
`;

export const GETPOST = gql`
  query Post($postId: String!) {
    post(id: $postId) {
      id
      title
      type
      status
      content
      likes
      created_at
      community_id {
        id
        about
        name
        background_pic
        profile_pic
        created_at
        posts {
          id
        }
        users {
          id
        }
        owner {
          id
        }
      }
      owner {
        ...userIdNameFields
        profile_pic
        status
      }
      tags {
        tag_id {
          name
        }
      }
    }
  }
  ${USER_ID_USERNAME}
`;

export const GETPOSTCOMMENTS = gql`
  query ListComments($filter: CommentfilterInput, $sort: [SortInput]) {
    listComments(filter: $filter, sort: $sort) {
      ...CoreCommentFields
    }
  }
  ${CORE_COMMENT_FIELDS}
`;

export const SUBSCRIBETOMORECOMMENT = gql`
  subscription NewComment {
    newComment {
      ...CoreCommentFields
    }
  }
  ${CORE_COMMENT_FIELDS}
`;
