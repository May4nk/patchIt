import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
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
  pollTypeDefs,
  chatpreferencesTypeDefs,
  notificationTypeDefs,
  userfollowingTypeDefs,
  magictokenTypeDefs,
  usercommentsTypeDefs,
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
  pollResolvers,
  chatpreferenceResolvers,
  notificationResolvers,
  userfollowingResolvers,
  magictokenResolvers,
  usercommentResolvers,
} from "./resolvers/index.js";

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
  posttagMutations,
  savedpostMutations,
  commentMutations,
  userpreferenceMutations,
  communitypreferenceMutations,
  pollsMutations,
  chatpreferenceMutations,
  notificationMutations,
  userfollowingMutations,
  usercommentMutations,
} from "./mutations/index.js";

const Query = ` 
  type Query {
    tag(id: String!): Tag
    post(id: String!): Post
    poll(id: String!): Poll
    role(role: String!): Role
    comment(id: String!): Comment
    message(id: String!): Message
    token(userId: String!): Token
    postTag(id: String!): PostTags
    chatroom(chatroomId: String!): Chatroom
    user(username: String!): User
    savedPost(id: String!): SavedPost
    userCommentLike(id: String!): UserComment
    notification(id: String!): Notification
    magicToken(email: String!): MagicToken
    userCommunity(id: String!): UserCommunity
    verifyMagicToken(token: String!): User
    userFollowing(id: String!): UserFollowing
    category(categoryname: String!): Category
    userChatroom(roomId: String): UserChatroom
    postlikedislike(id: String!): Postlikedislike
    community(communityname: String!): Community
    userpreference(username: String!): UserPreferences
    chatpreference(chatroomId: String!): ChatPreferences
    communitypreference(communityName: String!): CommunityPreferences
    listTags(filter: TagsfilterInput, sort: [SortInput], limit: Int): [Tag!]!
    listPosts(filter: PostfilterInput, sort: [SortInput], limit: Int): [Post!]!
    listPolls(filter: PollfilterInput, sort: [SortInput], limit: Int): [Poll!]!
    listRoles(filter: RolesfilterInput, sort: [SortInput], limit: Int): [Role!]!
    listUsers(filter: UsersfilterInput, sort: [SortInput], limit: Int): [User!]!    
    listTokens(filter: TokenfilterInput, sort: [SortInput], limit: Int): [Token!]!
    listComments(filter: CommentfilterInput, sort: [SortInput], limit: Int): [Comment!]!
    listMessages(filter: MessagesfilterInput, sort: [SortInput], limit: Int): [Message!]
    listPostTags(filter: PostTagsfilterInput, sort: [SortInput], limit: Int): [PostTags!]!
    listChatrooms(filter: ChatroomsfilterInput, sort: [SortInput], limit: Int): [Chatroom!]
    listSavedPost(filter: SavedPostfilterInput, sort: [SortInput], limit: Int): [SavedPost!]!
    listCategories(filter: CategoriesfilterInput, sort: [SortInput], limit: Int): [Category!]!
    listMagicTokens(filter: MagicTokenfilterInput, sort: [SortInput], limit: Int): [MagicToken]!
    listCommunities(filter: CommunitiesfilterInput, sort: [SortInput], limit: Int): [Community!]!
    listUserCommentLikes(filter: UserCommentfilterInput, sort: [SortInput], limit: Int): [UserComment]!
    listUserChatrooms(filter: UserChatroomfilterInput, sort: [SortInput], limit: Int): [UserChatroom]!
    listNotifications(filter: NotificationfilterInput, sort: [SortInput], limit: Int): [Notification]!
    listUserFollowing(filter: UserFollowingfilterInput, sort: [SortInput], limit: Int): [UserFollowing!]!
    listUsersCommunity(filter: UserCommunityfilterInput, sort: [SortInput], limit: Int): [UserCommunity!]!
    listChatPreferences(filter: ChatPreferencesfilterInput, sort: [SortInput], limit: Int): [ChatPreferences]!
    listPostLikeDislikes(filter: PostlikedislikefilterInput, sort: [SortInput], limit: Int): [Postlikedislike!]
    listCommunityPreferences(filter: CommunityPreferencesfilterInput, sort: [SortInput], limit: Int): [CommunityPreferences]!
  }

  type Mutation {
    refreshToken: User
    logoutUser(userId: String!): String
    upsertTag(data: UpsertTagInput): Tag
    loginUser(data: LoginUserInput): User
    insertUser(data: InsertUserInput): User
    updateUser(data: InsertUserInput): User
    insertPost(data: UpsertPostInput): Post
    updatePost(data: UpsertPostInput): Post
    upsertPolls(data: InsertPollInput): Poll
    checkRoomExists(data: CheckRoomExists): Boolean
    getSignedUrl(data: SignedUrlInput): [signedUrls]
    changePassword(data: ChangePasswordInput): User
    upsertComment(data: UpsertCommentInput): Comment
    insertMessage(data: InsertMessageInput): Message  
    forgetPassword(data: ForgetPasswordInput): String
    magicloginUser(data: MagicLinkLoginInput): String
    upsertChatroom(data: InsertChatroomInput): Chatroom
    upsertSavedPost(data: InsertSavedPostInput): SavedPost
    upsertCommunity(data: UpsertCommunityInput): Community
    requestForgetPassword(data: RequestForgetPasswordInput): String
    insertUserCommentLike(data: InsertUserCommentInput): UserComment
    batchInsertPostTags(data: [InsertPostTagsInput!]!): [PostTags]!
    insertUserFollowing(data: InsertUserFollowingInput): UserFollowing
    insertUserCommunity(data: InsertUserCommunityInput): UserCommunity
    insertUserChatroom(data: [InsertUserChatroomInput!]!): [UserChatroom]!
    upsertUserPreference(data: InsertUserPreferencesInput): UserPreferences
    upsertChatPreference(data: InsertChatPreferencesInput): ChatPreferences
    upsertPostLikeDislike(data: UpsertPostLikeDislikeInput): Postlikedislike
    batchInsertUserCommunity(data: [InsertUserCommunityInput!]!): [UserCommunity]!
    upsertCommunityPreference(data: InsertCommunityPreferencesInput): CommunityPreferences
    upsertNotification(data: InsertNotificationInput): Notification
    removeTag(data: RemoveTagInput): Tag
    removeUser(data: RemoveUserInput): User
    removePost(data: RemovePostInput): Post
    removePoll(data: RemovePollInput): Poll
    removeMessage(data: RemoveMessageInput): Message
    removeComment(data: RemoveCommentInput): Comment
    removePostTag(data: RemovePostTagsInput): PostTags
    removeChatroom(data: RemoveChatroomInput): Chatroom
    removeSavedPost(data: RemoveSavedPostInput): SavedPost
    removeCommunity(data: RemoveCommunityInput): Community 
    softDeleteChatroom(data: InsertChatroomInput): Chatroom
    removeUserChatroom(data: RemoveUserChatroomInput): UserChatroom
    removeNotification(data: RemoveNotificationInput): Notification
    removeUserCommentLike(data: RemoveUserCommentInput): UserComment
    removeUserCommunity(data: RemoveUserCommunityInput): UserCommunity
    removeChatPreference(data: RemoveChatPreferencesInput): ChatPreferences
    removeUserPreference(data: RemoveUserPreferencesInput): UserPreferences
    removePostLikeDislike(data: RemovePostLikeDislikeInput): Postlikedislike
    removeUserFollowing(data: RemoveUserFollowingInput): UserFollowing
    removeCommunityPreference(data: RemoveCommunityPreferencesInput): CommunityPreferences
  }
  type Subscription {
    newMessage: [Message]
    newComment: [Comment]
    newNotification(type: NOTIFICATIONTYPE!, userId: String!): [Notification]
    newUserChatroom(userId: String!): UserChatroom
  }
`;

export const allTypeDefs = mergeTypeDefs([
  Query,
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
  roleTypeDefs,
  categoryTypeDefs,
  communitypreferencesTypeDefs,
  pollTypeDefs,
  chatpreferencesTypeDefs,
  notificationTypeDefs,
  userfollowingTypeDefs,
  magictokenTypeDefs,
  usercommentsTypeDefs,
]);

export const allResolversAndMutations = mergeResolvers([
  tagResolvers,
  userResolvers,
  postResolvers,
  tokenResolvers,
  posttagsResolvers,
  savedpostResolvers,
  communityResolvers,
  chatroomResolvers,
  commentResolvers,
  messageResolvers,
  userchatroomResolvers,
  usercommentResolvers,
  userscommunityResolvers,
  magictokenResolvers,
  userpreferenceResolvers,
  postlikedislikeResolvers,
  communitypreferenceResolvers,
  roleResolvers,
  categoryResolvers,
  pollResolvers,
  chatpreferenceResolvers,
  notificationResolvers,
  userfollowingResolvers,
  savedpostMutations,
  userMutations,
  tagMutations,
  communityMutations,
  postMutations,
  messageMutations,
  usercommentMutations,
  chatroomMutations,
  postlikedislikeMutations,
  userscommunityMutations,
  commentMutations,
  userchatroomMutations,
  userpreferenceMutations,
  communitypreferenceMutations,
  posttagMutations,
  pollsMutations,
  chatpreferenceMutations,
  notificationMutations,
  userfollowingMutations,
]);
