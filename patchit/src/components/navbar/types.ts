import {
  communitynametype,
  IDSTYPE,
  NOTIFYSTATUS,
  NOTIFYTYPE,
  PRIVACY,
  USER_S_N_TYPE,
  usernametype,
} from "../../utils/main/types";

export interface communities extends IDSTYPE {
  name: string;
}

export interface usercommunitytype extends IDSTYPE {
  community_id: communitynametype;
}

export type navbarstatetype = {
  showChat: boolean;
  showLogin: boolean;
  showSearch: boolean;
  createCommunity: boolean;
  showCoinBar: boolean;
  showNotifications: boolean;
  newChat: number;
  newNotification: number;
};

export type navbarstateactiontype =
  | { type: "SHOW_CHAT"; show: boolean }
  | { type: "SHOW_NOTIFICATIONS"; show: boolean }
  | { type: "SHOW_LOGIN"; show: boolean }
  | { type: "SHOW_COINBAR"; show: boolean }
  | { type: "SHOW_SEARCH"; show: boolean }
  | { type: "CREATE_COMMUNITY"; show: boolean }
  | { type: "NEW_CHAT"; newChatMessages: number }
  | { type: "NEW_NOTIFICATIONS"; newNotification: number };

export type handlenavbarstatetype = (
  state: navbarstatetype,
  action: navbarstateactiontype
) => navbarstatetype;

export type navshowtype = (val: boolean) => void;

// export type setshowtype = <T extends navbarstateactiontype["type"]>(
//   type: T,
//   val: boolean
// ) => void;

//create community
export interface createCommunityprops {
  showCreateCommunity: boolean;
  setShowCreateCommunity: navshowtype;
}

export interface createcommunitydatatype {
  name: string;
  display_name: string;
  owner: string;
  privacy: PRIVACY;
  about: string;
  category: USER_S_N_TYPE;
}

export interface categorytype extends IDSTYPE {
  categoryicon: string;
  categoryname: string;
}

//notificaitiondrop
export interface notificationtype extends IDSTYPE {
  type: NOTIFYTYPE;
  message: string;
  status: NOTIFYSTATUS;
  fromuser: usernametype;
}

export type handleNotificationtype = (
  notification: notificationtype,
  notifyRes: boolean
) => Promise<void>;

export interface notificationdroppropstype {
  showNotificationdrop: boolean;
  setShowNotificationdrop: navshowtype;
  isNewNotification: (val: number) => void;
}

export interface notificationprevtype {
  listNotifications: notificationtype[];
}

export interface notificationdatatype {
  newNotification: notificationtype[];
}

export interface notificitionsubdatatype {
  subscriptionData: { data: notificationdatatype };
}

//patcoindrop
export interface patcoindroppropstype {
  showPatcoindrop: boolean;
  setShowPatcoindrop: navshowtype;
}
