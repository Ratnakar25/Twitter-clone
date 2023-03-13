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

// register route

app.post('/register', [
    body('name', 'Enter the valid name of length more than 4 characters').isLength({ min: 4 }),
    body('email', 'Enter the valid Email').isEmail(),
    body('password', 'Enter the valid password of length more than 4 characters').isLength({ min: 5 })
], async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, error: errors.array() });
        }

        const emailcheck = await User.findOne({ email });

        if (emailcheck) {
            return res.json({ status: false, message: "Email already exists!" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })

        const data = {
            user: {
                id: user.id
            }
        }

        const AuthToken = jwt.sign(data, JWT_SECRET_KEY)


        return res.json({ status: true, user, AuthToken })
    }
    catch (err) {
        // console.log(err);
        res.status(400).json({ status: 'error', error: err });
    }
})

//login route
app.post('/login', [
    body('email', 'Please enter valid email').isEmail(),
    body('password', 'Please enter valid password').isLength({ min: 4 })
], async (req, res) => {
    try {

        const error = validationResult(req)


        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() })
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email })

        if (!user) {
            return res.json({ status: false, message: "Invalid Crendentials" })
        }

        const isPasswordvalid = await bcrypt.compare(password, user.password);

        if (!isPasswordvalid) {
            return res.json({ status: false, message: "Invalid Crendentials" })
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const Authtoken = jwt.sign(data, JWT_SECRET_KEY)


        return res.status(200).json({ status: true, user, Authtoken })

    }
    catch (err) {
        return res.json({ status: false, error: err })
    }
})

// delete account

app.delete('/deleteuser', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })

        if (!user) {
            return res.json({ status: false, message: "Invalid Crendentials" })
        }

        const isPasswordvalid = await bcrypt.compare(password, user.password);

        if (!isPasswordvalid) {
            return res.json({ status: false, message: "Invalid Crendentials" })
        }


        await User.remove({ email }).then(() => {
            return res.json({ status: true, message: "Account Delete Successfully" })
        }).catch((err) => {
            return res.json({ status: false, error: err })

        })


    }
    catch (err) {
        return res.json({ status: false, error: err })
    }
})


// admin auth to delete accounts


app.delete('/admindelete', async (req, res) => {
    try {
        const { adminemail, password, useremail } = req.body;

        const user = await User.findOne({ email: adminemail })

        if (!user) {
            return res.json({ status: false, message: "Invalid Crendentials" })
        }
        const isPasswordvalid = await bcrypt.compare(password, user.password);

        if (!isPasswordvalid) {
            return res.json({ status: false, message: "Invalid Crendentials" })
        }

        if (user.admin === "no") {
            return res.json({ status: false, message: "You are not a admin" })
        }

        await User.remove({ useremail }).then(() => {
            return res.json({ status: true, message: "Account Delete Successfully" })
        }).catch((err) => {
            return res.json({ status: false, error: err })

        })


    }
    catch (err) {
        return res.json({ status: false, error: err })
    }
})


app.listen(port, () => { console.log(`server live at http://localhost:${port}`) });

mongoose.connect(mongo, { useUnifiedtopology: true, useNewUrlParser: true })
    .then((data) => { console.log("DB Connected succesfully") })
    .catch(err => console.error(err));