const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res)=>{
    res.render('index.html')
})

app.listen(8080, console.log('running at 8080'));