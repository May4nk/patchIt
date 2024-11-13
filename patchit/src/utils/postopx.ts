import client from "../client";

//queries
import {
  POSTLIKEDISLIKE,
  UPDATEPOST,
  UPSERTSAVEDPOST,
} from "../components/queries/post";

//types
import {
  communitytype,
  postlikeactiontype,
  postlikestatetype,
  postsaveopxtype,
  reactedposttype,
  savedposttype,
} from "../components/types/posttypes";

import {
  currentpostsavedstate,
  getuseractionstatetype,
  handlepostlikestatetype,
  handlesavingposttype,
  likestatetype,
  updatepostdblikedisliketype,
  updatepostdbsavepintype,
} from "./types";

export const updateDBPostLikeDislikes: updatepostdblikedisliketype = async (
  postlikes: number,
  userReact: postlikestatetype,
  postId: number,
  userId: number
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
          post_id: Number(postId),
        },
      },
    });

    //update post likes
    await client.mutate({
      mutation: UPDATEPOST,
      variables: {
        data: {
          id: Number(postId),
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
  userId: number | null,
  action: postlikeactiontype,
  likestate: likestatetype
) => {
  const { likeState, postLikes } = likestate;

  if (!userId) {
    return {
      newPostLikes: postLikes,
      navigateTo: "/account/login",
      newLikeState: likeState,
    };
  }

  if (action === "DISLIKE") {
    if (likeState === -1) {
      return { newPostLikes: postLikes + 1, newLikeState: 0 };
    } else if (likeState === 0) {
      return { newPostLikes: postLikes - 1, newLikeState: -1 };
    } else if (likeState === 1) {
      return { newPostLikes: postLikes - 2, newLikeState: -1 };
    }
  } else if (action === "LIKE") {
    if (likeState === -1) {
      return { newPostLikes: postLikes + 2, newLikeState: 1 };
    } else if (likeState === 0) {
      return { newPostLikes: postLikes + 1, newLikeState: 1 };
    } else if (likeState === 1) {
      return { newPostLikes: postLikes - 1, newLikeState: 0 };
    }
  }

  return { newPostLikes: postLikes, newLikeState: likeState };
};

export const handleSavingPost: handlesavingposttype = async (
  useraction: postsaveopxtype,
  userId: number | null,
  currentsavestate: currentpostsavedstate
) => {
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
  useraction: postsaveopxtype,
  userId: number | null,
  postId: number,
  savedState: boolean,
  pinnedState: boolean
) => {
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
          user_id: Number(userId),
          post_id: Number(postId),
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

export const getUserActionState: getuseractionstatetype = (
  communityId: number,
  postId: number,
  userSaved: savedposttype[],
  userReacted: reactedposttype[],
  userCommunities: communitytype[]
) => {
  let savedState: boolean = false;
  let pinnedState: boolean = false;
  let likedState: postlikestatetype = 0;
  let joinedState: boolean = false;

  if (userSaved?.length > 0) {
    const savedPost: savedposttype[] = userSaved?.filter(
      (post: savedposttype) => {
        return post?.post_id?.id === Number(postId);
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
        return post?.post_id?.id === Number(postId);
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
