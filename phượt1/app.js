var express = require("express");

var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false})); 


app.set("views", __dirname + "/views");
app.set("view engine", "ejs");    //combine data trong json và trả về file html động 

//static folder
app.use("/static", express.static(__dirname + "/public"));

var controllers = require(__dirname + "/controllers");

app.use(controllers);

app.listen(3000, () => { 
    console.log('Listening on port ${port}...');
});

