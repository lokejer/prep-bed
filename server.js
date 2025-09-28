const express = require("express");
const methodOverride = require("method-override");
const app = express();

// to serve static pages in the public folder
app.use(express.static("public"));

// initialise package method-override (converts POST requests into proper DELETE requests so that 'delete' endpoints are reached)
app.use(methodOverride('_method'));

// let our express app read data submitted from HTML forms (handle POST requests)
app.use(express.urlencoded({ extended: true }));

// set our default view engine to ejs
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/create-username', (req, res) => {
  let { username } = req.body;
  res.redirect(`/workouts/new?name=${encodeURIComponent(username)}`)
});

const workoutRouter = require("./routes/workouts.js");

app.use('/workouts', workoutRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server live at http://localhost:${PORT}`);
});