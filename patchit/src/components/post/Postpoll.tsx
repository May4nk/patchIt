import React, { useEffect, useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../common/hooks/useAuth';
//queries & mutations
import { UPDATEPOLL, GETPOLL } from "./queries";
import { UPDATEPOST } from '../queries/post';
//css & types
import "./postpoll.css";
import { authcontexttype } from '../../context/types';
import { polltype } from '../../containers/types/newposttypes';
interface postpollprops {
  pollData: string;
  pollPostId: number;
}

function Postpoll(postpollprops: postpollprops) {
  const { pollData, pollPostId } = postpollprops;

  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth();
  const userId: number | null = user && Number(user["id"] || user["user_id"]);
  const parsedPollData: polltype[] = JSON.parse(pollData);
  //state
  const [pollCount, setPollCount] = useState<polltype[]>();
  const [userSelectedPoll, setUserSelectedPoll] = useState<string>("");
  //queries
  const [updatepoll] = useMutation(UPDATEPOLL);
  const [updatepost] = useMutation(UPDATEPOST);
  const [getpolls, { data, loading }] = useLazyQuery(GETPOLL);
  //handlers
  const handleCount: (countValue: string, pid: number) => void = (countValue: string, pid: number) => {
    if (!user) {
      navigate("/account/login");
    } else {
      handlePoll(countValue, pid);
      const counterObj: number = pollCount!.findIndex((counter) => {
        return counter.value === countValue
      });
      const alteringPoll: polltype[] = [...pollCount!];
      let changedPoll: polltype = alteringPoll[counterObj];
      changedPoll.count = changedPoll.count + 1;
      setPollCount([...alteringPoll]);
      updatepoll({
        variables: {
          data: {
            user_id: userId,
            post_id: pollPostId,
            pollvalue: countValue
          }
        }
      });
      updatepost({
        variables: {
          data: {
            id: pollPostId,
            content: JSON.stringify(alteringPoll)
          }
        }
      });
    }
  }

  const handlePoll: (val: string, postId: number) => void = (val: string, postId: number) => {
    if (user) {
      const polls = document.querySelectorAll<HTMLElement>(`.p${postId}`);
      polls.forEach(poll => {
        poll.removeAttribute("onclick");
        poll.style.pointerEvents = "none";
        poll.style.background = "linear-gradient(70deg, #4e51538a 10%, #35353513 90%)";
      });
      document.querySelector(`.${val}`)?.classList.add("selectedpoll");
    }
  }

  useEffect(() => {
    if (pollData) {
      setPollCount([...parsedPollData]);
    }
  }, [pollData]);

  useEffect(() => {
    if (pollPostId && user) {
      getpolls({
        variables: {
          filter: {
            user_id: userId,
            post_id: pollPostId
          }
        }
      })

      if (!loading && data?.listPolls.length !== 0) {
        const pollChoice: string = data?.listPolls[0]?.pollvalue;
        setUserSelectedPoll(pollChoice);
      } else {
        setUserSelectedPoll("");
      }
    }
  }, [data, user]);

  useEffect(() => {
    if (userSelectedPoll?.length > 0) {
      handlePoll(userSelectedPoll, pollPostId);
    }
  }, [userSelectedPoll])

  return (
    <div className="pollwrapper" >
      {pollCount?.map((poll: polltype, idx: number) => (
        <div
          key={idx}
          className={`postpagepolloptions p${pollPostId} ${poll.value}`}
          onClick={() => handleCount(poll.value, pollPostId)}
        >
          {poll.value}
          <div className="pollrating">
            {poll.count > 0 ? poll.count : ""}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Postpoll;