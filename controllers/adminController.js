const asyncHandler = require("express-async-handler");

const adminFormGet = (req, res, next) => {
  const itemId = req.params.id;
  res.render("adminCheck", {
    title: "Admin Auth",
    itemId,
  });
};

const adminFormPost = asyncHandler(async (req, res, next) => {});

module.exports = { adminFormGet, adminFormPost };
