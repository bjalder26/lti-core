const fetch = require('node-fetch');
const { parseLaunch } = require("./launch");

// ✅ Submit function (your existing one)
async function submitResult({
  accessToken,
  lineItem,
  userId,
  type,
  score,
  maxScore,
  url
}) {
  const body = {
    userId,
    activityProgress: "Completed",
    gradingProgress: "FullyGraded"
  };

  if (type === "grade") {
    body.scoreGiven = score;
    body.scoreMaximum = maxScore;
  }

  if (type === "link") {
    body.comment = `View submission: ${url}`;
  }

  const endpoint = lineItem.endsWith("/scores")
    ? lineItem
    : lineItem + "/scores";

  return fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/vnd.ims.lis.v1.score+json"
    },
    body: JSON.stringify(body)
  });
}

// ✅ Export BOTH functions here
module.exports = {
  parseLaunch,
  submitResult
};

async function submitResult({
  accessToken,
  lineItem,
  userId,
  type,
  score,
  maxScore,
  url
}) {
  const body = {
    userId,
    activityProgress: "Completed",
    gradingProgress: "FullyGraded"
  };

  if (type === "grade") {
    body.scoreGiven = score;
    body.scoreMaximum = maxScore;
  }

  if (type === "link") {
    body.comment = `View submission: ${url}`;
  }

  return fetch(lineItem + "/scores", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/vnd.ims.lis.v1.score+json"
    },
    body: JSON.stringify(body)
  });
}

module.exports = {
  submitResult
};