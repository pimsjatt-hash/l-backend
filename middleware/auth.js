const allowedUsers = [
  { name: "vibhanshi", code: "love" },
  { name: "priyanshu", code: "love" }
];

module.exports = (req, res, next) => {
  const name = (req.headers["name"] || "").trim();
  const code = (req.headers["code"] || "").trim();

  console.log("AUTH CHECK →", { name, code });

  const isValid = allowedUsers.some(
    u => u.name === name && u.code === code
  );

  if (!isValid) {
    return res.status(401).json({ message: "Unauthorized ❤️" });
  }

  req.user = name;
  next();
};
