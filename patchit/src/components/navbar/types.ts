import {
  communitynametype,
  NOTIFICATIONTYPE,
  PRIVACY,
  usernametype,
} from "../../utils/main/types";

export interface communities {
  id: number;
  communityname: string;
}

export interface usercommunitytype {
  id: number;
  community_id: communitynametype;
}

export type newnotificationtiptype = { notification: boolean; chat: boolean };

//create community
export interface createCommunityprops {
  showCreateCommunity: boolean;
  setShowCreateCommunity: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface createcommunitydatatype {
  communityname: string;
  owner: number;
  privacy: PRIVACY;
  about: string;
  category: string | null;
}

export interface categorytype {
  id: number;
  categoryicon: string;
  categoryname: string;
}

export interface upsertcommunitytype {
  id: number;
  communityname: string;
}

//notificaitiondrop
export interface notificationtype {
  id: number;
  type: NOTIFICATIONTYPE;
  message: string;
  status: string;
  fromuser: usernametype;
}

export type handleNotificationtype = (
  notification: notificationtype,
  notifyRes: boolean
) => Promise<void>;

export interface notificationdroppropstype {
  showNotificationdrop: boolean;
  setShowNotificationdrop: React.Dispatch<React.SetStateAction<boolean>>;
  isNewNotification: React.Dispatch<
    React.SetStateAction<newnotificationtiptype>
  >;
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
  setShowPatcoindrop: React.Dispatch<React.SetStateAction<boolean>>;
}
