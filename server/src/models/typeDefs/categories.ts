export const categoryTypeDefs = `
  type Category {
    id: String
    categoryname: String!
    categoryicon: String
    created_at: String
  }

  input UpsertCategoryInput {
    id: String
    categoryname: String!
    categoryicon: String
  }

  input CategoriesfilterInput {
    id: String
    categoryname: String
    categoryicon: String
  }
    
  input RemoveCategoryInput {
    categoryname: String!
  }
`;
