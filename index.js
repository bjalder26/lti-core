const fetch = require('node-fetch');

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