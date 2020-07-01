const express = require('express');
const path = require('path');
const app = express();

const 

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res)=>{
    res.render('index.html')
})

app.listen(process.env.PORT || 8080, console.log('running at 8080'));