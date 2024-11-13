import React from "react";
//types
interface pollrulespropstype {
  rules: string;
  idx: number;
}

const PollRule = (pollrulespropstype: pollrulespropstype) => {
  const { rules, idx } = pollrulespropstype;

  return (
    <span>
      <span className="rulesL"> {idx}. </span>
      {rules}
    </span>
  );
};

export default PollRule;
