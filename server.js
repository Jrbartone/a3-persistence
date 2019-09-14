// server.js
// where your node app starts

// init project
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const app = express();
app.use(bodyParser.json())
let currentSession = ["", ""]
let allUsers = []
const admin = {user:"admin", pass:"admin"}
let me = JSON.stringify(admin)
//allUsers.push(me)
let entry = {"word":"a","lang":"en-sq","translation":"një","action":"translate","id":1,"user":"admin"}
let appdata = []
var FileSync = require('lowdb/adapters/FileSync')
var adapter = new FileSync('.data/db.json')
var db = low(adapter)
appdata.push(entry)
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

db.defaults({ users: [
      {"username":"admin", "password":"admin"}
    ]
  }).write();


function syncAllUsers(){
  allUsers = []
  var users = db.get('users').value() // Find all users in the collection
  users.forEach(function(user) {
    allUsers.push(JSON.stringify({user : user.username, pass: user.password})); // adds their info to the dbUsers value
  });
  return allUsers
}


const translateWord = function(word, lang){
  return new Promise(function(resolve, reject){
        var url = "https://translate.yandex.net/api/v1.5/tr.json/translate",
        keyAPI = "trnsl.1.1.20190907T141217Z.e39e2bd5353a5df3.d131c190bafbb7bf7eaf7b11c9c2122ea683c7dd";
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        let xhr = new XMLHttpRequest(),
            textAPI = encodeURI(word),
            langAPI = lang
            let req = 'key='+keyAPI+'&text='+textAPI+'&lang='+langAPI;
        xhr.open("POST",url,true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(req);
        xhr.onreadystatechange = function() {
            if (this.readyState==4) {
                let res = this.responseText;
                var json = JSON.parse(res);
                //console.log(json.text[0]);
                resolve( json.text[0])
            }
        }
  });
}


app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/home.html');
});

app.get('/index.html', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/login.html', function(request, response) {
  response.sendFile(__dirname + '/views/login.html');
});

app.get('/about.html', function(request, response) {
  response.sendFile(__dirname + '/views/about.html');
});

app.get('/create.html', function(request, response) {
  response.sendFile(__dirname + '/views/create.html');
});


// TRANSLATION SUBMISSION
app.post('/submit', function (req, res) {
  let dataString = ''
  req.on( 'data', function( data ) {
      dataString += data 
  })
  req.on( 'end', function() {
    let body = JSON.parse( dataString )
    var translation = ""
    
    switch(body.action){
      case "translate":
        console.log(appdata)
        console.log("translate")
        let payload = {word:body.word, lang: body.lang, translation: "", action: body.action, id:body.id, user:body.user};
        translateWord(body.word, body.lang).then(function(retVal){
            payload.translation += retVal;
            res.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
            appdata.push(payload);
            res.end(JSON.stringify(payload));
          });
        break;
      case "delete":
        console.log("delete")
        let i = 0;
        let id = body.id
        console.log(body.id)
        for (i = 0; i < appdata.length; i++){
          if (JSON.stringify(appdata[i]).includes("" + id)){
            appdata.splice(i, 1)
          }
        }
        break;
        
      case "edit":
        console.log("edit")
        let k = 0;
        let j = body.id
        let editWord = ""
        for (k = 0; k < appdata.length; k++){
          if (JSON.stringify(appdata[k]).includes("" + j)){
            console.log("k" + appdata[k])
            editWord = appdata[k].word //this is undefined?????
            appdata.splice(k, 1)
          }
        }
        //console.log(editWord)
        let editedLoad = {word:editWord, lang: body.lang, translation: "", action: body.action, id:body.id, user: body.user};
        translateWord(editWord, body.lang).then(function(retVal){
            editedLoad.translation += retVal;
            res.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
            appdata.push(editedLoad);
            console.log(appdata)
            res.end(JSON.stringify(editedLoad));
          });
        break;
    }
    //end of switch case
  })
  //end of datastream
})


// HANDLE LOGIN
app.post('/login', function (req, res) {
  allUsers = syncAllUsers()
  console.log((allUsers))
  console.log("handlig log")
  let dataString = ''
  req.on( 'data', function( data ) {
      dataString += data 
  })
  req.on( 'end', function() {
  let data = JSON.parse(dataString)
  console.log(data)
    if(allUsers.length > 0){
      for (let i = 0; i < allUsers.length; i++){
        let obj = JSON.parse(allUsers[i])
        if (obj.user == data.user && obj.pass == data.pass){
          currentSession[0] = data.user;
          currentSession[1] = data.pass;
          console.log(" login")
          res.send("OK")
          //send all packets of user data
          return
        }
        else{
          //console.log("bad login")
          //res.send("BAD")
        }
      }
       console.log("bad login")
       res.send("BAD")
      return
    }
    else{
       console.log("bad login")
       res.send("BAD")
      return
    }
  })
})


//HANDLE ACCOUNT CREATION
app.post('/create', function (req, res) {
  console.log("creating acc")
  let dataString = ''
  req.on( 'data', function( data ) {
      dataString += data 
  })
  req.on( 'end', function() {
  let data = JSON.parse(dataString)
  console.log(data)
    if(allUsers.length > 0){
      for (let i = 0; i < allUsers.length; i++){
        let obj = JSON.parse(allUsers[i])
        if (obj.user == data.user){
          console.log(" login")
          res.end("BAD")
          return
        }
      }
        db.get('users')
          .push({ username: data.user, password: data.pass })
          .write()
        console.log("New user inserted in the database");
        data = JSON.stringify(data)
        allUsers.push(data)
        res.send("OK")
    }
    else{
         db.get('users')
          .push({ username: data.user, password: data.pass })
          .write()
        console.log("New user inserted in the database");
        data = JSON.stringify(data)
        allUsers.push(data)
        res.send("OK")
      return
    }
  })
})


app.post('/userData', function (req, res) {
  let pack = JSON.stringify(appdata)
  console.log(pack)
  console.log(appdata)
  res.end(pack)
})


app.post('/queryLogin', function (req, res) {
  console.log(currentSession.join(','))
  res.end(currentSession.join(','))
})


var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
