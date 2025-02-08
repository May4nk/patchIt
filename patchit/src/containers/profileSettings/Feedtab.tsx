import React from 'react';
//components
import Settingtab from '../../components/settings/Settingtab';
//css & types
import "./profilesettings.css";
import { feedprops } from './types';

function Feedtab(feedprops: feedprops) {
  const { handleChange, feedsState } = feedprops;

  return (
    <div className="usetting">
      <div className="usettingtitle"> Feeds Settings </div>
      <div className="usettingtitlemeta"> Content Preferences </div>
      <Settingtab
        title={"Adult Content"}
        type={"switch"}
        metatitle={"Enable to view adult and NSFW (not safe for work) content in your feed and search results."}
        name={"show_nsfw"}
        value={feedsState.show_nsfw}
        handleChange={(e: any) => handleChange(e, "feeds")}
      />
    </div>
  )
}

export default Feedtab;