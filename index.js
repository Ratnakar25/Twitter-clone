const express = require('express');
const port = 3001;
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyparser = require('body-parser')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const JWT_SECRET_KEY = "hi";

const mongo = "mongodb+srv://ratnakar:password1234@cluster0.xasd5t0.mongodb.net/?retryWrites=true&w=majority"
const User = require("./model/users")
const Post = require("./model/posts")

app.use(cors());
app.use(bodyparser.json())

app.get('/', (req, res) => {
    res.send('landing page');
})

app.listen(port, () => { console.log(`server live at http://localhost:${port}`) });

mongoose.connect(mongo, { useUnifiedtopology: true, useNewUrlParser: true })
    .then((data) => { console.log("DB Connected succesfully") })
    .catch(err => console.error(err));