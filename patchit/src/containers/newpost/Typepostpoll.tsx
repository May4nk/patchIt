import React from "react";

//components
import PollRule from "./Pollrule";
import Askinput from "../../components/html/Askinput";

//css & types, constants
import "./css/typepostpoll.css";
import { pollrules } from "../../constants/const";
import { newpolltype, posttypepollprops } from "./types";

const Typepostpoll = (posttypepollprops: posttypepollprops) => {
  const { polls, setPolls } = posttypepollprops;

  //handlers
  const handlepolloptions: () => void = () => {
    setPolls([...polls, { value: "", count: 0 }]);
  }

  const handleOnChange: (e: any, index: number) => void = (e: any, index: number) => {
    let temppolls: newpolltype[] = [...polls];
    (temppolls[index] as any)[e.target.name as keyof typeof polls] = e.target.value;
    setPolls([...temppolls]);
  }

  const handleDeleteOption: (idx: number) => void = (idx: number) => {
    let pollarray = [...polls];
    pollarray.splice(idx, 1);
    setPolls(pollarray);
  }

  return (
    <div className="polloptions" >
      <div className="options">
        {polls.map((poll: newpolltype, idx: number) => (
          <div className="pollinputs" key={idx}>
            <Askinput
              name={"value"}
              placeholder={`option${idx + 1}`}
              maxlength={30}
              required={true}
              postfix={polls.length > 2 ? "ICdelete" : null}
              onClickPostfix={() => handleDeleteOption(idx)}
              onChange={(e: any) => handleOnChange(e, idx)}
              value={poll.value}
            />
          </div>
        ))}
        {polls.length < 6 && (
          <div className="waves-effect waves-light addoptions" onClick={handlepolloptions}>
            Add More
          </div>
        )}
      </div>
      <div className="pollrules">
        <span className="typeofpost">
          <i className="material-icons tiny"> info </i>
          <span className="rulesL">Some tips for better poll </span>
        </span>
        {pollrules.map((pollrule: string, idx: number) => (
          <PollRule rules={pollrule} key={idx} idx={++idx} />
        ))}
      </div>
    </div>
  )
}

export default Typepostpoll;
