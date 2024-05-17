const express = require('express');
const app = express();

app.use (express.static("public"));

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    console.log("Here");
    res.render("index", {text: "Hi"});
})

app.listen(3000)