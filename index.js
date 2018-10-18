const express = require("express");
const app = express();

<<<<<<< HEAD
const PORT = process.env.PORT || 3000;

app.set("port", PORT);


const path = require('path');

app.use(express.static(path.join(__dirname, 'src')));
app.set('src', path.join(__dirname, 'src'));
app.set('view engine', 'html');

app.get('/', function(req, res){
    res.render("index");
});

app.use(function(req, res){
    res.type("text/plain"),
    res.status(404);
    res.send('404 - Not Found');
});
    
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});
=======

app.get('/', (req, res, next) => {
    res.send(`Server started on port ${PORT}`);
})


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
>>>>>>> 5c4401524528d609b30aaf08dcdeff9e7b08a9d7
