export const categoryTypeDefs = `
  type Category {
    id: Int
    categoryname: String!
    categoryicon: String
    created_at: String
  }
  input UpsertCategoryInput {
    id: Int
    categoryname: String!
    categoryicon: String
  }
  input CategoriesfilterInput {
    id: Int
    categoryname: String
    categoryicon: String
  }
  input RemoveCategoryInput {
    categoryname: String!
  }
`;
