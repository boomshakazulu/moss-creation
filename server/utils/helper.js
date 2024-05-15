module.exports = {
  UrlEncode: function (text) {
    return Buffer.from(text)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  },

  UrlDecode: function (text) {
    const paddedText = text + "=".repeat((4 - (text.length % 4)) % 4); // Add padding if needed
    return Buffer.from(
      paddedText.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString("utf-8");
  },
};
