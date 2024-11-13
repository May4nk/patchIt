import React, { useEffect, useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../utils/hooks/useAuth';

//queries & mutations
import { UPDATEPOST } from '../queries/post';
import { UPDATEPOLL, GETPOLL } from "./queries";

//css & types
import "./css/postpoll.css";
import { polltype, postpollprops } from './types';
import { authcontexttype } from '../../context/types';
import { newpolltype } from '../../containers/newpost/types';

function Postpoll(postpollprops: postpollprops) {
  const { pollData, pollPostId } = postpollprops;

  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth();
  const userId: number | null = user && Number(user["id"] || user["user_id"]);
  const parsedPollData: newpolltype[] = JSON.parse(pollData);

  //state
  const [pollCount, setPollCount] = useState<newpolltype[]>();
  const [userSelectedPoll, setUserSelectedPoll] = useState<string>("");

  //queries
  const [updatepoll] = useMutation(UPDATEPOLL);
  const [updatepost] = useMutation(UPDATEPOST);
  const [getpolls, { data }] = useLazyQuery(GETPOLL);

  //handlers
  const handleCount: (countValue: string, pid: number) => void = async (countValue: string, pid: number) => {
    if (!user) {
      navigate("/account/login");
      return;
    }

    handlePoll(countValue, pid);

    if (!pollCount) return;

    const tempPoll: newpolltype[] = [...pollCount];
    const pollIndex: number = tempPoll.findIndex((counter) => {
      return counter.value === countValue
    });

    if (pollIndex === -1) return;

    tempPoll[pollIndex].count += 1;
    setPollCount(tempPoll);

    try {
      await updatepoll({
        variables: {
          data: {
            user_id: userId,
            post_id: pid,
            pollvalue: countValue
          }
        }
      });

      await updatepost({
        variables: {
          data: {
            id: pid,
            content: JSON.stringify(tempPoll)
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  const handlePoll: (val: string, postId: number) => void = (val: string, postId: number) => {
    if (!user) return;
    const polls = document.querySelectorAll<HTMLElement>(`.poll${postId}`);

    polls.forEach(poll => {
      poll.removeAttribute("onclick");
      poll.style.pointerEvents = "none";

      const bgElement = poll?.children[1] as HTMLElement;

      if (bgElement) {
        bgElement.style.background = "linear-gradient(70deg, #4e51538a 10%, #35353513 90%)";
      }
    });

    const selectedpoll = document.querySelector<HTMLElement>(`.${val}`);

    if (selectedpoll) {
      const selectedTxtElement = selectedpoll?.children[0] as HTMLElement;
      const selectedBgElement = selectedpoll?.children[1] as HTMLElement;

      if (selectedTxtElement) {
        selectedTxtElement.style.color = "white";
      }

      if (selectedBgElement) {
        selectedBgElement.style.background = "linear-gradient(70deg, #4696d88a 10%, #35353513 90%)";
      }
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
        },
        onCompleted: ({ listPolls }: { listPolls: polltype[] }) => {
          if (listPolls) {
            const pollChoice: string = listPolls[0]?.pollvalue;
            setUserSelectedPoll(pollChoice);
          } else {
            setUserSelectedPoll("");
          }
        }
      })
    }
  }, [data, user]);

  useEffect(() => {
    if (userSelectedPoll?.length > 0) {
      handlePoll(userSelectedPoll, pollPostId);
    }
  }, [userSelectedPoll])

  return (
    <div className="pollwrapper" >
      {pollCount?.map((poll: newpolltype, idx: number) => (
        <div
          key={idx}
          className={`polloption poll${pollPostId} ${poll.value}`}
          onClick={() => handleCount(poll.value, pollPostId)}
        >
          <div className="pollvalue">
            {poll.value}
          </div>
          <div className="pollrating"></div>
        </div>
      ))}
    </div>
  )
}

export default Postpoll;