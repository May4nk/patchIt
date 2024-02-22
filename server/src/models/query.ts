import {  mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";

import { 
  userTypeDefs,
  postTypeDefs,
  communityTypeDefs,
  tagTypeDefs,
  messageTypeDefs,
  chatroomTypeDefs,
  userchatroomTypeDefs,
  postlikedislikeTypeDefs,
  usercommunityTypeDefs,
  savedpostTypeDefs,
  commentTypeDefs,
  posttagsTypeDefs,
  tokenTypeDefs,
  userpreferencesTypeDefs,
  communitypreferencesTypeDefs,
  roleTypeDefs,
  categoryTypeDefs,
} from "./typeDefs/index.js";

import { 
  userResolvers, 
  postResolvers, 
  tagResolvers, 
  communityResolvers, 
  communitypreferenceResolvers,
  messageResolvers, 
  chatroomResolvers, 
  userchatroomResolvers,
  postlikedislikeResolvers, 
  userscommunityResolvers, 
  savedpostResolvers,
  commentResolvers,
  posttagsResolvers,
  tokenResolvers,
  userpreferenceResolvers,
  roleResolvers,
  categoryResolvers,
}  from "./resolvers/index.js";

import { 
  userMutations,
  postMutations,
  communityMutations,
  tagMutations,
  messageMutations,
  userchatroomMutations,
  chatroomMutations,
  postlikedislikeMutations,
  userscommunityMutations,
  savedpostMutations,
  commentMutations,
  userpreferenceMutations,
} from "./mutations/index.js";


const Query = ` 
  type Query {
    user(username: String!): User
    tag(id: Int!): Tag
    token(userId: Int!): Token
    postTag(id: Int!): PostTags
    community(communityname: String!): Community
    post(id: Int!): Post
    message(id: Int!): Message
    chatroom(id: Int!): Chatroom
    userChatroom(roomId: String): UserChatroom
    postlikedislike(id: Int!): Postlikedislike
    userCommunity(id: Int!): UserCommunity
    savedPost(id: Int!): SavedPost
    comment(id: Int!): Comment
    role(role: String!): Role
    category(categoryname: String!): Category
    userpreference(userId: Int!): UserPreferences
    communitypreference(communityName: String!): CommunityPreferences
    listUsers(filter: UsersfilterInput, sort: [SortInput], limit: Int ): [User!]!    
    listUserPreferences(filter: UserPreferencesfilterInput, sort: [SortInput], limit: Int ): [UserPreferences]!
    listTokens(filter: TokenfilterInput, sort: [SortInput], limit: Int): [Token!]!
    listCommunities(filter: CommunitiesfilterInput, sort: [SortInput], limit: Int ): [Community!]!
    listCommunityPreferences(filter: CommunityPreferencesfilterInput, sort: [SortInput], limit: Int ): [CommunityPreferences]!
    listTags(filter: TagsfilterInput, sort: [SortInput], limit: Int ): [Tag!]!
    listRoles(filter: RolesfilterInput, sort: [SortInput], limit: Int ): [Role!]!
    listCategories(filter: CategoriesfilterInput, sort: [SortInput], limit: Int ): [Category!]!
    listPostTags(filter: PostTagsfilterInput, sort: [SortInput], limit: Int ): [PostTags!]!
    listPosts(filter: PostfilterInput, sort: [SortInput], limit: Int ): [Post!]!
    listMessages(filter: MessagesfilterInput, sort: [SortInput], limit: Int ): [Message!]
    listChatrooms(filter: ChatroomsfilterInput, sort: [SortInput], limit: Int ): [Chatroom!]
    listUserChatrooms(filter: UserChatroomfilterInput, sort: [SortInput], limit: Int ): [UserChatroom]!
    listSpecificUserChatrooms(userId: Int!):[UserChatroom]!
    listPostLikeDislikes(filter: PostlikedislikefilterInput, sort: [SortInput], limit: Int ): [Postlikedislike!]
    listUsersCommunity(filter: UserCommunityfilterInput, sort: [SortInput], limit: Int ): [UserCommunity!]!
    listComments(filter: CommentfilterInput, sort: [SortInput], limit: Int ): [Comment!]!
    listSavedPost(filter: SavedPostfilterInput, sort: [SortInput], limit: Int ): [SavedPost!]!
  }
  type Mutation {
    insertUser(data: InsertUserInput): User
    updateUser(data: InsertUserInput): User
    loginUser(data: LoginUserInput): User
    upsertUserPreference(data: InsertUserPreferencesInput): UserPreferences
    magicloginUser(data: MagicLinkLoginInput): User
    upsertPost(data: UpsertPostInput): Post
    upsertComment(data: UpsertCommentInput): Comment
    upsertCommunity(data: UpsertCommunityInput): Community
    upsertPostLikeDislike(data: UpsertPostLikeDislikeInput): Postlikedislike
    upsertTag(data: UpsertTagInput): Tag
    upsertSavedPost(data: InsertSavedPostInput): SavedPost
    insertMessage(data: InsertMessageInput): Message    
    insertUserChatroom(data: [InsertUserChatroomInput!]!): [UserChatroom]!
    insertChatroom(data: InsertChatroomInput): Chatroom
    insertUserCommunity(data: InsertUserCommunityInput): UserCommunity
    batchInsertUserCommunity(data: [InsertUserCommunityInput!]!): [UserCommunity]!
    removeUser(data: RemoveUserInput): User
    removePost(data: RemovePostInput): Post
    removeComment(data: RemoveCommentInput): Comment
    removeCommunity(data: RemoveCommunityInput): Community 
    removeTag(data: RemoveTagInput): Tag
    removePostLikeDislike(data: RemovePostLikeDislikeInput): Postlikedislike
    removeMessage(data: RemoveMessageInput): Message
    removeChatroom(data: RemoveChatroomInput): Chatroom
    softDeleteChatroom(data: InsertChatroomInput): Chatroom
    removeUserChatroom(data: RemoveUserChatroomInput): UserChatroom
    removeUserCommunity(data: RemoveUserCommunityInput): UserCommunity
    removeSavedPost(data: RemoveSavedPostInput): SavedPost
    removeUserPreference(data: RemoveUserPreferencesInput): UserPreferences
  }
  type Subscription {
    newMessage: [Message]
    newUserChatroom(userId: Int!): [UserChatroom]
    newComment: [Comment]
  }
`;

export const allTypeDefs = mergeTypeDefs([ Query, userTypeDefs, postTypeDefs, communityTypeDefs, tagTypeDefs, messageTypeDefs, chatroomTypeDefs, userchatroomTypeDefs, postlikedislikeTypeDefs, usercommunityTypeDefs, savedpostTypeDefs, commentTypeDefs, posttagsTypeDefs, tokenTypeDefs, userpreferencesTypeDefs, roleTypeDefs, categoryTypeDefs, communitypreferencesTypeDefs ]);

export const allResolversAndMutations = mergeResolvers([ userResolvers, postResolvers, userscommunityResolvers, postlikedislikeResolvers, savedpostResolvers, tagResolvers, posttagsResolvers, communityResolvers, chatroomResolvers, commentResolvers, messageResolvers, userchatroomResolvers, tokenResolvers, userpreferenceResolvers, communitypreferenceResolvers, roleResolvers, categoryResolvers,  savedpostMutations, userMutations, tagMutations, communityMutations,  postMutations, messageMutations, chatroomMutations, postlikedislikeMutations, userscommunityMutations, commentMutations, userchatroomMutations, userpreferenceMutations ]);

