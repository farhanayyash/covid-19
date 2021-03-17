'use strict';


const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override');
const pg = require('pg');
const superagent = require('superagent');


const app = express();

require('dotenv').config();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);

// const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });



app.get("/",homehandler);
app.post("/getCountryResult",getCountryResulthandler);
app.get("/AllCountries",AllCountries);
app.post("/AddMyRecords",AddMyRecords);
app.get("/MyRecords",MyRecords);
app.get("/RecordDetails/:id",RecordDetails);

app.delete("/deleteMyRecords/:id",deleteMyRecords);



function RecordDetails(req ,res){
  let id = req.params.id;
  console.log(id);
  let sql = "SELECT * FROM cards WHERE card_id = $1;"
  let value = [id];
  client.query(sql,value).then((results)=>{
    console.log(results.rows)
    res.render('pages/RecordDetails',{data:results.rows});
  })
}



function deleteMyRecords(req ,res){
  let id = req.params.id;
  console.log(id);
  let sql = "DELETE FROM cards WHERE card_id = $1;"
  let value = [id];
  client.query(sql,value).then((results)=>{
    res.redirect("/MyRecords");
  })
}


function MyRecords(req ,res){
  let sql = "SELECT * FROM cards;"
  client.query(sql).then((results)=>{
    res.render('pages/MyRecords',{data:results.rows});
  })
}

function AddMyRecords(req,res){
  let {Country ,TotalConfirmed ,TotalDeaths ,TotalRecovered,Date } = new cards(req.body);
  let sql = 'INSERT INTO cards (Country, TotalConfirmed, TotalDeaths,TotalRecovered,Date) VALUES ($1,$2,$3,$4,$5);'
  let values = [Country ,TotalConfirmed ,TotalDeaths ,TotalRecovered,Date];
  client.query(sql,values).then((results)=>{
    res.redirect("/MyRecords");
  })
}

function AllCountries(req ,res){
  let url = "https://api.covid19api.com/summary";
  superagent.get(url).then((results)=>{
    console.log(results.body)
    res.render('pages/AllCountries',{data:results.body.Countries});
  })
}

function getCountryResulthandler(req,res){
  let url = `https://api.covid19api.com/country/${req.body.Country}/status/confirmed?from=${req.body.Date1}T00:00:00Z&to=${req.body.Date2}T00:00:00Z`;
  superagent.get(url).then((results)=>{
    res.render('pages/getCountryResult',{data:results.body});
  })
}

function homehandler(req ,res){
  let url = "https://api.covid19api.com/world/total";
  superagent.get(url).then((results)=>{
    res.render('pages/home',{data:results.body});
  })
}



//CONSTRUCTOR 
function cards(country){
  this.Country = country.Country;
  this.TotalConfirmed = country.TotalConfirmed;
  this.TotalDeaths = country.TotalDeaths;
  this.TotalRecovered = country.TotalRecovered;
  this.Date = country.Date;
}

const PORT = process.env.PORT || 3000;
client.connect().then(()=>{
  app.listen(PORT,()=>{
    console.log(`port ${PORT}`);
  })
})