import React from 'react';
//css & types
import "./profilesettings.css";
import { feedsstatetype } from './profilesettingtypes';
interface feedprops {
  handleChange: (e: any, statename: string) => void;
  feedsState: feedsstatetype;
}

function Feedtab(feedprops: feedprops) {
  const { handleChange, feedsState } = feedprops;

  return (
    <div className="usetting">
      <div className="usettingtitle"> Feeds Settings </div>
      <div className="usettingtitlemeta"> Content Preferences </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Adult Content </div>
          <div className="usettingitemmetatitle">
            Enable to view adult and NSFW (not safe for work) content in your feed and search results.
          </div>
        </div>
        <div className="switch">
          <label>
            <input
              type="checkbox"
              className="blue-text"
              name="show_nsfw"
              checked={feedsState.show_nsfw}
              onChange={(e: any) => handleChange(e, "feeds")}
            />
            <span className="lever"></span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default Feedtab;