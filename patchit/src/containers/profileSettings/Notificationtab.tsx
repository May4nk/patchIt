import React from 'react';
//components
import Settingtab from '../../components/settings/Settingtab';
//css & types
import "./profilesettings.css";
import { notificationprops } from './types';

function Notificationtab(notificationprops: notificationprops) {
  const { handleChange, notificationsState } = notificationprops;

  return (
    <div className="usetting">
      <div className="usettingtitle"> Notification Preferences </div>
      <div className="usettingtitlemeta"> Messages </div>
      <Settingtab
        title={"Chat requests"}
        type={"switch"}
        name={"chatreq"}
        value={notificationsState.chatreq}
        handleChange={(e: any) => handleChange(e, "notifications")}
      />
      <div className="usettingtitlemeta"> Activity </div>
      <Settingtab
        title={"Mention of u/username"}
        type={"switch"}
        name={"mentionusername"}
        value={notificationsState.mentionusername}
        handleChange={(e: any) => handleChange(e, "notifications")}
      />
      <Settingtab
        title={"Activity on your posts"}
        type={"switch"}
        metatitle={"Any activity (upvotes, downvotes, comments) on your done post."}
        name={"activityonpost"}
        value={notificationsState.activityonpost}
        handleChange={(e: any) => handleChange(e, "notifications")}
      />
      <Settingtab
        title={"Activity on your comment"}
        type={"switch"}
        metatitle={"Any activity (upvotes, replies) on your done comment."}
        name={"activityoncmnt"}
        value={notificationsState.activityoncmnt}
        handleChange={(e: any) => handleChange(e, "notifications")}
      />
      <Settingtab
        title={"Activity on your followed post"}
        type={"switch"}
        metatitle={"Any activity (upvotes, downvotes, comments) on your followed post."}
        name="activityonpostfollowed"
        value={notificationsState.activityonpostfollowed}
        handleChange={(e: any) => handleChange(e, "notifications")}
      />
      <Settingtab
        title={"Activity on your followed community"}
        type={"switch"}
        metatitle={"Any activity (new posts, new rules, new pinned posts, new announcements) in your followed community."}
        name={"communityfollowed"}
        value={notificationsState.communityfollowed}
        handleChange={(e: any) => handleChange(e, "notifications")}
      />
      <Settingtab
        title={"Patcoins you receive"}
        type={"switch"}
        name={"patcoinreceived"}
        value={notificationsState.patcoinreceived}
        handleChange={(e: any) => handleChange(e, "notifications")}
      />
      <div className="usettingtitlemeta"> Updates </div>
      <Settingtab
        title={"Birthday"}
        type={"switch"}
        metatitle={"Any follower or community birth/created date."}
        name="birthday"
        value={notificationsState.birthday}
        handleChange={(e: any) => handleChange(e, "notifications")}
      />
      <Settingtab
        title={"Patch announcements"}
        type={"switch"}
        name={"announcements"}
        value={notificationsState.announcements}
        handleChange={(e: any) => handleChange(e, "notifications")}
      />
    </div>
  )
}

export default Notificationtab;