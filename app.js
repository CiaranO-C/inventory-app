const express = require("express");

const app = express();
const PORT = process.env.PORT || 5050;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter)
app.use('/dashboard' dashboardRouter)

app.use((err, req, res, next) => {
  if (err.statusCode) {
    console.error(err.statusCode, err.message);
    return;
  }

  res.status(500).send("Internal server error");
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
