"use strict";

// from issue: https://github.com/EnCiv/undebate-ssp/issues/5

import React from "react";
import { createUseStyles } from "react-jss";

export const statusEnum = {
  done: "Done",
  "done and locked": "Done and Locked",
  pending: "Pending",
  "invite accepted": "Invite Accepted",
  sent: "Sent",
  "reminder sent": "Reminder Sent",
  "invite declined": "Invite Declined",
  "deadline missed": "Deadline Missed",
  "in progress": "In Progress",
};

export function ElectionCategory(props) {
  const classes = useStyles(props);
  const {
    categoryName = "",
    status = "",
    daysLeft,
    className = "",
    // numCandidatesRecorded, // used in styles
    // numCandidates, // used in styles
  } = props;

  const inProgress = status.toLowerCase() == "in progress";
  const statusText =
    inProgress && daysLeft != null
      ? `${daysLeft} days left…`
      : statusEnum[status] || status;
  return (
    <div className={`${classes.category} ${className}`}>
      <span>{categoryName}</span>
      <span>{statusText}</span>
      {inProgress && (
        <>
          <hr className={classes.lineBreak} />
          <div className={classes.progressBar} />
        </>
      )}
    </div>
  );
}

const useStyles = createUseStyles({
  category: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderRadius: "0.6vw",
    padding: "1rem",
  },
  lineBreak: {
    width: "100%",
    border: "none",
    margin: "0.2rem",
  },
  progressBar: (props) => {
    const percentDone =
      (props.numCandidatesRecorded / props.numCandidates) * 100;
    const percentNotDone = 100 - percentDone;
    return {
      background: `linear-gradient(to right, #7470FF ${percentDone}%, #FFFFFF ${percentNotDone}%)`,
      width: "100%",
      height: "1em",
      borderRadius: "0.3vw",
    };
  },
});

export default ElectionCategory;
