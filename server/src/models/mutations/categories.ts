export const categoryTypeDefs = `
  type Category {
    id: Int
    categoryname: String!
    created_at: String
  }
  input UpsertCategoryInput {
    id: Int
    categoryname: String!
  }
  input CategoriesfilterInput {
    id: Int
    categoryname: String
  }
  input RemoveCategoryInput {
    categoryname: String!
  }
`;
