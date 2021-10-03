const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
// const session = require('express-session')
//database connection
const url = 'mongodb://localhost:27017/pizza';

mongoose.connect(url,{ 
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log('Database connected...');
}).catch(err => {
    console.log(err);
});

//session config

//assets 
app.use(express.static('public'))

//set tamplate engine

app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

 require('./routes/web.js')(app)


app.listen(PORT,() => {
    console.log(`listing on port ${PORT}`)
})
