const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const port = '27017';
const db_name = 'Chat_db';
mongoose.connect(
    `mongodb://localhost:${port}/${db_name}`,{useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true})
    .then( result => {console.log(`connected to ${db_name} at port ${port}`);})
    .catch( err => {console.log(err)});

const models_path = path.join(__dirname, './../models');
fs.readdirSync(models_path).forEach( file => {
    if(file.indexOf('.js') >= 0) {
        require(models_path + '/' + file);
    }
});