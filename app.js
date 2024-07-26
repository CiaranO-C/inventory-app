const express = require("express");
const indexRouter = require("./routes/indexRouter");
const dashboardRouter = require("./routes/dashboardRouter");
const adminRouter = require('./routes/adminRouter')
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5050;

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/dashboard", dashboardRouter);
app.use('/admin', adminRouter)

app.use((err, req, res, next) => {

  if (err.statusCode) {
    console.error(err.statusCode, err.message);
    return;
  }

  res.status(500).send("Internal server error");
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
