const express = require("express");
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const Url = require("./models/url")
const sessionNow = require('express-session');
const cookieParser = require('cookie-parser')
const flashMessage = require("connect-flash");
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;



mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(
        () => {
            console.log("CONNECTION TO MONGODB OPEN!");
        }
    )
    .catch(
        err => {
            console.log("CONNECTION ERROR!!!")
            console.log(err)
        }
    );

app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('keyboard cat'));
app.use(sessionNow({ cookie: { maxAge: 60000 }, secret: "urlshortener", saveUninitialized: false, resave: false }));
app.use(flashMessage());

app.get('/', (req, res) => {
    const url = req.flash('url');
    res.render("homepage.ejs", { url });
});

app.post('/urls', async (req, res) => {
    const newUrl = new Url(req.body);
    if(newUrl.urlOriginal == "urls") {
        res.redirect('/');
    }
    await newUrl.save()
        .then(() => {
            req.flash('url', req.body.urlOriginal);
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/');
        });
});

app.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;
    if(shortUrl == "urls") {
        res.redirect('/');
    }

    const urlObject = await Url.findOne({ urlShortened: shortUrl }).exec();


    if (urlObject == null) {
        return res.sendStatus(404);
    }

    res.redirect(urlObject.urlOriginal);
});

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});