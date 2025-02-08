import client from "../../client";
import { FetchResult } from "@apollo/client";

//services
import { getSignedUrls } from "../services/s3";

//queries
import {
  GETUSERALLREACTIONS,
  POSTLIKEDISLIKE,
  UPDATEPOST,
  UPSERTSAVEDPOST,
} from "../../components/queries/post";

//types
import { postpagetype } from "../../containers/types/postpage";
import { LIKEREACTION, posttype, RESPONSETYPE } from "../main/types";
import { imagetype, newpoststatetype } from "../../containers/newpost/types";
import {
  communitytype,
  postacttiontype,
  postlikeactiontype,
  poststatetype,
  reactedposttype,
  savedposttype,
  useractiontype,
} from "../../components/types/posttypes";
import {
  getuseractionstatetype,
  handlepostlikestatetype,
  handlesavingposttype,
  likestatetype,
  updatepostdblikedisliketype,
  updatepostdbsavepintype,
  signedurltype,
  updatepostdbsavepindatatype,
  handlesavingpostdatatype,
  getuseractionstatedatatype,
  signedfiletype,
  userreactiontype,
} from "../types";

//new post state
export const newPostInitState: newpoststatetype = {
  postData: {
    title: "",
    content: "",
    type: "BLOG",
    community_id: null,
  },
  postImages: [],
  postTags: [],
  postPolls: [
    { value: "", count: 0 },
    { value: "", count: 0 },
  ],
  selectedCommunity: "",
  error: { status: 0, message: "", show: false },
  uploadProgress: 0,
};

//post
export const postInitState: poststatetype = {
  likes: 0,
  inCommunity: false,
  saved: false,
  pinned: false,
  liked: "NONE",
  images: [],
  isOwnerActive: true,
  commentSortBy: "likes",
  display_user_pic: null,
  display_community_pic: null,
  error: { status: 0, message: "", show: false },
};

export function handlePostState(
  state: poststatetype,
  action: postacttiontype
): poststatetype {
  switch (action.type) {
    case "JOIN_COMMUNITY":
      return { ...state, inCommunity: action.inCommunity };

    case "PIN_POST":
      return { ...state, pinned: action.pinned };

    case "SAVE_POST":
      return { ...state, saved: action.saved };

    case "SET_LIKES":
      return { ...state, likes: action.likes };

    case "SET_LIKED":
      return { ...state, liked: action.liked };

    case "UPDATE_COMMUNITY_PIC":
      return { ...state, display_community_pic: action.community_pic };

    case "UPDATE_USER_PIC":
      return { ...state, display_user_pic: action.user_pic };

    case "SET_IMAGES":
      return { ...state, images: action.images };

    case "SET_ERROR":
      return { ...state, error: action.error };

    case "SET_COMMENT_SORTBY":
      return { ...state, commentSortBy: action.sortBy };

    case "SET_OWNER_STATUS":
      return { ...state, isOwnerActive: action.status };

    case "RESET":
      return {
        ...state,
        inCommunity: false,
        saved: false,
        pinned: false,
        liked: "NONE",
        images: [],
        commentSortBy: "likes",
        error: { status: 0, message: "", show: false },
      };

    default:
      return state;
  }
}

export const updateDBPostLikeDislikes: updatepostdblikedisliketype = async (
  postlikes: number,
  userReact: LIKEREACTION,
  postId: string,
  userId: string
) => {
  if (!userId) {
    return {
      status: 401,
      message: "User not Authorized",
      navigateTo: "/account/login",
    };
  }

  try {
    //update like table
    await client.mutate({
      mutation: POSTLIKEDISLIKE,
      variables: {
        data: {
          user_id: userId,
          reaction: userReact,
          post_id: postId,
        },
      },
    });

    //update post likes
    await client.mutate({
      mutation: UPDATEPOST,
      variables: {
        data: {
          id: postId,
          likes: postlikes,
        },
      },
    });

    return { status: 200, message: "Update successfully" };
  } catch (err) {
    return {
      status: 500,
      message: err as string,
    };
  }
};

export const handlePostLikes: handlepostlikestatetype = async (
  userId: string,
  action: postlikeactiontype,
  likestate: likestatetype
) => {
  const { liked, postLikes } = likestate;

  if (!userId) {
    return {
      newPostLikes: postLikes,
      navigateTo: "/account/login",
      newLikeState: liked,
    };
  }

  if (action === "DISLIKE") {
    if (liked === "FALSE") {
      return { newPostLikes: postLikes + 1, newLikeState: "NONE" };
    } else if (liked === "NONE") {
      return { newPostLikes: postLikes - 1, newLikeState: "FALSE" };
    } else if (liked === "TRUE") {
      return { newPostLikes: postLikes - 2, newLikeState: "FALSE" };
    }
  } else if (action === "LIKE") {
    if (liked === "FALSE") {
      return { newPostLikes: postLikes + 2, newLikeState: "TRUE" };
    } else if (liked === "NONE") {
      return { newPostLikes: postLikes + 1, newLikeState: "TRUE" };
    } else if (liked === "TRUE") {
      return { newPostLikes: postLikes - 1, newLikeState: "NONE" };
    }
  }

  return { newPostLikes: postLikes, newLikeState: liked };
};

export const handleSavingPost: handlesavingposttype = async (
  data: handlesavingpostdatatype
) => {
  const { useraction, userId, currentsavestate } = data;
  const { pinnedState, savedState } = currentsavestate;

  if (!userId) {
    return {
      newPinnedState: pinnedState,
      newSavedState: savedState,
      navigateTo: "/account/login",
    };
  }

  if (useraction === "SAVE") {
    return {
      newPinnedState: pinnedState,
      newSavedState: !savedState,
    };
  } else if (useraction === "PIN") {
    return {
      newPinnedState: !pinnedState,
      newSavedState: savedState,
    };
  }

  return { newPinnedState: pinnedState, newSavedState: savedState };
};

export const updateDBSavingPost: updatepostdbsavepintype = async (
  data: updatepostdbsavepindatatype
) => {
  const { useraction, userId, postId, savedState, pinnedState } = data;

  if (userId === null) {
    return {
      status: 401,
      message: "User not Authorized",
      navigateTo: "/account/login",
    };
  }

  try {
    await client.mutate({
      mutation: UPSERTSAVEDPOST,
      variables: {
        data: {
          user_id: userId,
          post_id: postId,
          ...(useraction === "SAVE" && { saved: savedState }),
          ...(useraction === "PIN" && { pinned: pinnedState }),
        },
      },
    });

    return { status: 200, message: `Post ${useraction} successfully` };
  } catch (err) {
    return { status: 500, message: err as string };
  }
};

export const getUserActions: getuseractionstatetype = (
  data: getuseractionstatedatatype
) => {
  const { userSaved, postId, communityId, userCommunities, userReacted } = data;

  let savedState: boolean = false;
  let pinnedState: boolean = false;
  let likedState: LIKEREACTION = "NONE";
  let joinedState: boolean = false;

  if (userSaved?.length > 0) {
    const savedPost: savedposttype[] = userSaved?.filter(
      (post: savedposttype) => {
        return post?.post_id?.id === postId;
      }
    );

    if (savedPost[0]) {
      savedState = savedPost[0].saved;
      pinnedState = savedPost[0].pinned;
    }
  }

  if (userCommunities?.length > 0) {
    const joinedCommunity: communitytype[] = userCommunities?.filter(
      (community: communitytype) => {
        return community?.community_id?.id === communityId;
      }
    );

    if (joinedCommunity.length > 0) {
      joinedState = true;
    }
  }

  if (userReacted?.length > 0) {
    const reactedPost: reactedposttype[] = userReacted?.filter(
      (post: reactedposttype) => {
        return post?.post_id?.id === postId;
      }
    );

    if (reactedPost[0]) {
      likedState = reactedPost[0].reaction;
    }
  }

  return {
    savedState,
    pinnedState,
    likedState,
    joinedState,
  };
};

//handlers for post types for both post and postpage
export const handlePostImages: (
  post: postpagetype | posttype
) => Promise<RESPONSETYPE> = async (post) => {
  if (post.type !== "IMAGE") {
    return {
      status: 500,
      message: "Post not image type...",
    };
  }

  const postImages: imagetype[] = JSON.parse(post.content!);
  const urlImages: signedfiletype[] = postImages.map((data: imagetype) => ({
    name: data?.postSrc,
  }));

  try {
    const signedUrls: signedurltype[] = await getSignedUrls({
      postId: post.id,
      userId: post.owner.id,
      req: "GET",
      files: urlImages,
    });

    const response: RESPONSETYPE = {
      status: 200,
      message: JSON.stringify([
        ...signedUrls.map((url: signedurltype, idx: number) => ({
          postSrc: url.signedUrl,
          postCaption: postImages[idx].postCaption,
          postLink: postImages[idx].postLink,
        })),
      ]),
    };

    return response;
  } catch (err) {
    return {
      status: 500,
      message: "Unable to get post images...",
    };
  }
};

export const handleUserReactions: (
  post: postpagetype | posttype,
  userId: string
) => Promise<RESPONSETYPE> = async (post, userId: string) => {
  try {
    const { data }: FetchResult<{ listUsers: useractiontype[] }> =
      await client.mutate({
        mutation: GETUSERALLREACTIONS,
        variables: {
          filter: {
            id: userId,
          },
        },
      });

    if (data?.listUsers) {
      const userActions: useractiontype = data?.listUsers[0];

      const userSaved: useractiontype["savedposts"] = userActions?.savedposts;
      const userReacted: useractiontype["reactedposts"] =
        userActions?.reactedposts;
      const userCommunities: useractiontype["communities"] =
        userActions?.communities;

      const updatedUserActions: userreactiontype = getUserActions({
        communityId: post?.community_id?.id,
        postId: post.id!,
        userSaved: userSaved,
        userCommunities: userCommunities,
        userReacted: userReacted,
      });

      return {
        status: 200,
        message: JSON.stringify(updatedUserActions),
      };
    } else {
      return {
        status: 500,
        message: "Unable to fetch user reactions...",
      };
    }
  } catch (err) {
    return {
      status: 500,
      message: "Unable to fetch user reactions...",
    };
  }
};
