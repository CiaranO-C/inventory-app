const asyncHandler = require("express-async-handler");

const adminFormGet = (req, res, next) => {
    const path = '/dashboard' + req.path;
    console.log(path)
  res.render("adminCheck", {
    title: "Admin Auth",
    path
  });
};

const passwordReceiver = (req, res, next) => {
  const password = req.body.password;
  const path = req.path;
};

const adminFormPost = asyncHandler(async (req, res, next) => {});

module.exports = { adminFormGet, adminFormPost };
