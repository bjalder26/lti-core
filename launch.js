const jwt = require("jsonwebtoken");

function parseLaunch(idToken) {
  if (!idToken) {
    throw new Error("Missing id_token");
  }

  // ⚠️ For now: decode WITHOUT verifying signature
  // (we'll add verification later when Canvas is connected)
  const decoded = jwt.decode(idToken);

  if (!decoded) {
    throw new Error("Invalid id_token");
  }

  const userId = decoded.sub;

  const ags =
    decoded["https://purl.imsglobal.org/spec/lti-ags/claim/endpoint"];

  const lineItem = ags?.lineitem;

  return {
    userId,
    lineItem,
    rawToken: decoded
  };
}

module.exports = {
  parseLaunch
};