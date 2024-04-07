const express = require('express');
const app = express();

const port = 3000;

const bodyParser = require('body-parser');


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));


app.get("/", (req, res) => {
    //res.send("Hello");
    let person = req.body;
    res.render("index", { person: person });
});

app.post('/submit', (req, res) => {
    let person = req.body;
    res.render("index", { person: person });
});


app.listen(port, () => {
    console.log(`App running at port: ${port}`);
});