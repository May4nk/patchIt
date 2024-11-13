import React from 'react';

//components
import Settingtab from '../../components/settings/Settingtab';

//types
import { notificationtabpropstype } from './types';

function NotificationTab(notificaitiontabprops: notificationtabpropstype) {
  const { notificationsState, handleChange } = notificaitiontabprops;

  return (
    <div className="usetting">
      <div className="usettingtitle"> Notification Preferences </div>
      <div className="usettingtitlemeta"> Messages </div>
      <Settingtab
        title={"New user requests"}
        type={"switch"}
        name={"newuserreq"}
        value={notificationsState.newuserreq}
        handleChange={(e: any) => handleChange(e, "notifications")}
      />
      <div className="usettingtitlemeta"> Activity </div>
      <Settingtab
        title={"Post Reports"}
        type={"switch"}
        metatitle={"Any user reports post of community."}
        name={"reportonpost"}
        value={notificationsState.reportonpost}
        handleChange={(e: any) => handleChange(e, "notifications")}
      />
      <Settingtab
        title={"Comment Reports"}
        type={"switch"}
        metatitle={"Any user reports comment done on any post of community."}
        name={"reportoncmnt"}
        value={notificationsState.reportoncmnt}
        handleChange={(e: any) => handleChange(e, "notifications")}
      />
      <Settingtab
        title={"User Reports"}
        type={"switch"}
        metatitle={"Any user reports another user of community."}
        name={"reportonuser"}
        value={notificationsState.reportonuser}
        handleChange={(e: any) => handleChange(e, "notifications")}
      />
      <Settingtab
        title={"Activity in community"}
        type={"switch"}
        metatitle={"Any kind of activity (new posts, new suggested rules, new suggested pinned posts, new rooms) in community."}
        name={"activityincommunity"}
        value={notificationsState.activityincommunity}
        handleChange={(e: any) => handleChange(e, "notifications")}
      />
      <div className="usettingtitlemeta"> Updates </div>
      <Settingtab
        title={"Birthday"}
        type={"switch"}
        metatitle={"Any community user birthday."}
        name={"birthday"}
        value={notificationsState.birthday}
        handleChange={(e: any) => handleChange(e, "notifications")}
      />
    </div>
  )
}

export default NotificationTab;