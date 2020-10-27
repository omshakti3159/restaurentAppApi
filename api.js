const express = require('express');
const app = express();
const bodyParsor = require('body-parser');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const cors = require('cors');
const port = process.env.PORT || 3159;
let db;
app.use(cors());
app.use(bodyParsor.urlencoded({ extended: true }));
app.use(bodyParsor.json());
const mongoUrl = "mongodb+srv://omy:13580@Okm@cluster0.ru34c.mongodb.net/restaurentApp?retryWrites=true&w=majority"
app.get('/', (req, res) => {
    res.send(`<a href="https://restaurentappapi.herokuapp.com/cuisine">cuisine</a>
    res.send(`<a href="https://restaurentappapi.herokuapp.com/city">city</a>
    res.send(`<a href="https://restaurentappapi.herokuapp.com/restaurent">restaurents</a>
    res.send(`<a href="https://restaurentappapi.herokuapp.com/mealtype">mealtype</a>

`)
})
//-------city route----------
app.get('/city', (req, res) => {

    db.collection('city').find({}).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    })
})
//-------Cuisine route-------
app.get('/cuisine', (req, res) => {
    db.collection('cuisine').find({}).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    })
})
//--------restaurent route------
app.get('/restaurent', (req, res) => {
    let query = {};
    if (req.query.city && req.query.mealtype) {
        query = { city: req.query.city, "type.mealtype": req.query.mealtype }
    }
    else if (req.query.city) {
        query = { city: req.query.city }
    }
    else if (req.query.mealtype) {
        query = { "type.mealtype": req.query.mealtype }
    }

    else {
        query = {};
    }
    db.collection('restaurants').find(query).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    })
})
//--------mealtype route--------
app.get('/mealtype', (req, res) => {
    db.collection('mealtype').find({}).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

//---------reataurent details--------
app.get('/restaurentdetails/:id', (req, res) => {
    let query = { _id: req.params.id }
    db.collection('restaurants').find(query).toArray((err, result) => {
        res.send(result);
    })
})
//-----------restaurent listing---------
app.get('/restaurentlist/:mealtype', (req, res) => {
    let query = {};
    if (req.query.cuisine) {
        query = { "type.mealtype": req.params.mealtype, "Cuisine.cuisine": req.query.cuisine }
    }
    else if (req.query.city) {
        query = { "type.mealtype": req.params.mealtype, city: req.query.city }
    }
    else if (req.query.hcost && req.query.lcost) {
        query = { "type.mealtype": req.params.mealtype, cost: { $lt: Number(req.query.hcost), $gt: Number(req.query.lcost) } }
    }
    else {
        query = { "type.mealtype": req.params.mealtype }
    }
    db.collection('restaurants').find(query).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    })
})





MongoClient.connect(mongoUrl, (err, connection) => {
    if (err) throw err;
    db = connection.db("restaurentApp");
    app.listen(port,'0.0.0.0', (err) => {
        if (err) throw err;
        console.log(`server is runing on port ${port}`)
    })
})
