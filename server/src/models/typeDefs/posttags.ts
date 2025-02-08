export const posttagsTypeDefs = `
  type PostTags {
    id: String
    post_id: Post
    tag_id: Tag
    created_at: String
  }

  input InsertPostTagsInput {
    post_id: String!
    tag_id: String!
  }

  input PostTagsfilterInput {
    id: String
    tag_id: String
    post_id: String
  }
    
  input RemovePostTagsInput {
    id: String
    post_id: String
  }
`;
