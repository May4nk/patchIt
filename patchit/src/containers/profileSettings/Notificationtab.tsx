import React from 'react';
//css & types
import "./profilesettings.css";
import { notificationsstatetype } from './profilesettingtypes';
interface notificationprops {
  notificationsState: notificationsstatetype;
  handleChange: (e: any, statename: string) => void;
}

function Notificationtab(notificationprops: notificationprops) {
  const { handleChange, notificationsState } = notificationprops;

  return (
    <div className="usetting">
      <div className="usettingtitle"> Notification Preferences </div>
      <div className="usettingtitlemeta"> Messages </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Chat requests </div>
        </div>
        <div className="switch blue-text">
          <label>
            <input
              type="checkbox"
              className="blue-text"
              name="chatreq"
              checked={notificationsState.chatreq}
              onChange={(e: any) => handleChange(e, "notifications")}
            />
            <span className="lever"></span>
          </label>
        </div>
      </div>
      <div className="usettingtitlemeta"> Activity </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Mention of u/username </div>
        </div>
        <div className="switch blue-text">
          <label>
            <input
              type="checkbox"
              className="blue-text"
              name="mentionusername"
              checked={notificationsState.mentionusername}
              onChange={(e: any) => handleChange(e, "notifications")}
            />
            <span className="lever"></span>
          </label>
        </div>
      </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Activity on your posts </div>
          <div className="usettingitemmetatitle">
            Any activity (upvotes, downvotes, comments) on your done post.
          </div>
        </div>
        <div className="switch blue-text">
          <label>
            <input
              type="checkbox"
              className="blue-text"
              name="activityonpost"
              checked={notificationsState.activityonpost}
              onChange={(e: any) => handleChange(e, "notifications")}
            />
            <span className="lever"></span>
          </label>
        </div>
      </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Activity on your comment </div>
          <div className="usettingitemmetatitle">
            Any activity (upvotes, replies) on your done comment.
          </div>
        </div>
        <div className="switch blue-text">
          <label>
            <input
              type="checkbox"
              className="blue-text"
              name="activityoncmnt"
              checked={notificationsState.activityoncmnt}
              onChange={(e: any) => handleChange(e, "notifications")}
            />
            <span className="lever"></span>
          </label>
        </div>
      </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Activity on your followed post </div>
          <div className="usettingitemmetatitle">
            Any activity (upvotes, downvotes, comments) on your followed post.
          </div>
        </div>
        <div className="switch blue-text">
          <label>
            <input
              type="checkbox"
              className="blue-text"
              name="activityonpostfollowed"
              checked={notificationsState.activityonpostfollowed}
              onChange={(e: any) => handleChange(e, "notifications")}
            />
            <span className="lever"></span>
          </label>
        </div>
      </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Activity on your followed community </div>
          <div className="usettingitemmetatitle">
            Any activity (new posts, new rules, new pinned posts, new announcements) in your followed community.
          </div>
        </div>
        <div className="switch blue-text">
          <label>
            <input
              type="checkbox"
              className="blue-text"
              name="communityfollowed"
              checked={notificationsState.communityfollowed}
              onChange={(e: any) => handleChange(e, "notifications")}
            />
            <span className="lever"></span>
          </label>
        </div>
      </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Patcoins you receive </div>
        </div>
        <div className="switch blue-text">
          <label>
            <input
              type="checkbox"
              className="blue-text"
              name="patcoinreceived"
              checked={notificationsState.patcoinreceived}
              onChange={(e: any) => handleChange(e, "notifications")}
            />
            <span className="lever"></span>
          </label>
        </div>
      </div>
      <div className="usettingtitlemeta"> Updates </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Birthday </div>
          <div className="usettingitemmetatitle"> Any follower or community birth/created date. </div>
        </div>
        <div className="switch blue-text">
          <label>
            <input
              type="checkbox"
              className="blue-text"
              name="birthday"
              checked={notificationsState.birthday}
              onChange={(e: any) => handleChange(e, "notifications")}
            />
            <span className="lever"></span>
          </label>
        </div>
      </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Patch announcements </div>
        </div>
        <div className="switch blue-text">
          <label>
            <input
              type="checkbox"
              className="blue-text"
              name="announcements"
              checked={notificationsState.announcements}
              onChange={(e: any) => handleChange(e, "notifications")}
            />
            <span className="lever"></span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default Notificationtab;