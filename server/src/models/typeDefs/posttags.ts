export const posttagsTypeDefs = `
  type PostTags {
    id: Int
    post_id: Post
    tag_id: Tag
    created_at: String
  }
  input InsertPostTagsInput {
    post_id: Int!
    tag_id: Int!
  }
  input PostTagsfilterInput {
    id: Int
    post_id: Int
    tag_id: Int
  }
  input RemovePostTagsInput {
    id: Int
    post_id: Int
  }
` ;
