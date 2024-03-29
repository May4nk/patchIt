import React from "react";

//components
import PollRule from "./Pollrule";
import Askinput from "../html/Askinput";

import { pollrules } from "../../constants/const"; //constants

import "./css/typepostpoll.css"; //css

type polltype = { poll: string };

interface posttypepollprops {  
  inputList: polltype[];
  setInputList: React.Dispatch<React.SetStateAction<polltype[]>>;
}

const Typepostpoll = (posttypepollprops: posttypepollprops) => {
  const { inputList, setInputList } = posttypepollprops;  
     
  //handler
  const handlepolloptions: () => void = () => {
    setInputList([ ...inputList , { poll: "" } ]);
  }

  const handleOnChange: (e: any, index: number) => void = (e:any, index: number) => {
    let temppolls: polltype[] = [...inputList];
    (temppolls[index] as any )[e.target.name as keyof typeof inputList] = e.target.value;   
    setInputList([ ...temppolls ]);
  }
  
  const handleDeleteOption: (idx: number) => void = (idx: number) => {    
    let pollarray = [...inputList];
    pollarray.splice(idx, 1);
    setInputList(pollarray);
  }
  
  return (
    <div className="polloptions" >
      <div className="options">        
        {inputList.map((poll: polltype, idx: number) => (
          <div className="pollinputs" key={ idx }>     
            <Askinput 
              name={ "poll" } 
              placeholder={`option${idx+1}`} 
              maxlength={ 30 } 
              required={ true } 
              postfix={ inputList.length > 2 ? "ICdelete" : null }
              onClickPostfix={() => handleDeleteOption(idx)} 
              onChange={(e: any) => handleOnChange(e,idx)} 
              value={ poll.poll } 
            />
          </div>
        ))}
        { inputList.length < 6 && (
          <div className="waves-effect waves-light addoptions" onClick={ handlepolloptions }> 
            Add More 
          </div>
        )}
      </div>
      <div className="pollrules">
        <span className="typeofpost">
          <i className="material-icons tiny"> info </i>
          <span className="rulesL">Some tips for better poll </span>
        </span>
        { pollrules.map((pollrule: string, idx: number) => (
          <PollRule rules={ pollrule } key={ idx } idx={ ++idx } />  
        ))}
      </div>
    </div>
  )
}

export default Typepostpoll;
