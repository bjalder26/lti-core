const fetch = require('node-fetch');
const { parseLaunch } = require("./launch");
const jwt = require("jsonwebtoken");

// ✅ Access token
async function getAccessToken({
  clientId,
  tokenUrl,
  privateKey,
  scopes
}) {
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    iss: clientId,
    sub: clientId,
    aud: tokenUrl,
    iat: now,
    exp: now + 300,
    jti: Math.random().toString(36).substring(2)
  };

  const clientAssertion = jwt.sign(payload, privateKey, {
    algorithm: "RS256"
  });

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append(
    "client_assertion_type",
    "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
  );
  params.append("client_assertion", clientAssertion);
  params.append("scope", scopes.join(" "));

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Token request failed: " + JSON.stringify(data));
  }

  return data.access_token;
}

// ✅ Submission
async function submitResult({
  accessToken,
  lineItem,
  userId,
  type,
  score,
  maxScore,
  url,
  platform = "canvas" // default for now
}) {

  const body = {
    userId,
    timestamp: new Date().toISOString(),
    activityProgress: "Completed"
  };

  // ✅ Standard LTI behavior
  if (type === "grade") {
    body.scoreGiven = score;
    body.scoreMaximum = maxScore;
    body.gradingProgress = "FullyGraded";
  }

  if (type === "manual") {
    body.gradingProgress = "PendingManual";
    body.comment = `Submission: ${url}`;
  }

  // ✅ Canvas-specific extensions
  if (platform === "canvas") {

    if (type === "url_submission") {
      body.gradingProgress = "PendingManual";

      body["https://canvas.instructure.com/lti/submission"] = {
        submission_type: "online_url",
        url: url
      };

      // fallback
      body.comment = `Submission (backup): ${url}`;
    }

    if (type === "lti_submission") {
      body.gradingProgress = "PendingManual";

      body["https://canvas.instructure.com/lti/submission"] = {
        submission_type: "basic_lti_launch",
        submission_data: url
      };

      body.comment = `Launch submission: ${url}`;
    }
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

// ✅ ONE export only
module.exports = {
  parseLaunch,
  submitResult,
  getAccessToken
};
``