import React from 'react';

//css & types
import "./css/postpoll.css";
type polltype = { poll: string };
interface postpollprops {
  polldata: string;
}

function Postpoll(postpollprops: postpollprops) {
  const { polldata } = postpollprops;
  const polls: polltype[] = polldata && JSON.parse(polldata);
  
  return (
    <div className="pollwrapper">
      {polls.map((pollobj: polltype, idx: number) => (      
        <div className="poll" key={ idx }>
          { pollobj.poll }
          <div className="pollstatus">
            0 %
          </div>
        </div>        
      ))}    
    </div>
  )
}

export default Postpoll