export const postTypeDefs = `
  enum STATUS {
    ACTIVE
    INACTIVE
  }
    
  enum TYPE {
    BLOG
    IMAGE
    POLL
    LINK
  }

  enum REQTYPE {
    GET
    PUT
  }
  
  type Post {
    id: String!
    title: String!
    owner: User!
    content: String
    type: TYPE
    likes: Int
    status: STATUS!
    community_id: Community    
    created_at: String!
    tags: [PostTags]
    comments: [Comment]
  }  
  
  type signedUrls {
    signedUrl: String
    fileUrl: String
    req: REQTYPE
  }

  input UpsertPostInput {
    id: String
    title: String
    owner: String
    community_id: String
    content: String
    type: TYPE
    status: STATUS    
    likes: Int
  }

  input RemovePostInput {
    id: String!
  }

  input PostfilterInput {
    id: String
    owner: String
    community_id: String
    tag: String
    type: TYPE
    status: STATUS    
    likes: Int
  }

  input UrlFiles {
    name: String!
    type: String
  }

  input SortInput {
    column: String
    order: String
    nulls: String
  }

  input SignedUrlInput {
    postId: String!
    userId: String!
    req: REQTYPE!
    files: [UrlFiles]!
  }
`;
