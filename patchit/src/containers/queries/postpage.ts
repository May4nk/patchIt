import { gql } from "@apollo/client";

const CORE_COMMENT_FIELDS = gql`
  fragment CoreCommentFields on Comment {
    id
    comment
    likes
    created_at
    parent_id {
      id
      comment
      status
    }
    user_id {
      id
      username
      profile_pic
      status
    }
  }
`;

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
      community_id {
        id
        about
        communityname
        background_pic
        profile_pic
        created_at
        posts {
          id
        }
        users {
          id
        }
      }
      owner {
        id
        profile_pic
        username
        status
      }
      tags {
        tag_id {
          name
        }
      }
    }
  }
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
