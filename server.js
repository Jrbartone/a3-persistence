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
const appdata = []
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

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
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/login.html', function(request, response) {
  response.sendFile(__dirname + '/views/login.html');
});

app.get('/about.html', function(request, response) {
  response.sendFile(__dirname + '/views/about.html');
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
        console.log("translate")
        let payload = {word:body.word, lang: body.lang, translation: "", action: body.action, id:body.id};
        translateWord(body.word, body.lang).then(function(retVal){
            payload.translation += retVal;
            res.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
            appdata.push(JSON.stringify(payload));
            res.end(JSON.stringify(payload));
          });
        break;
      case "delete":
        console.log("delete")
        let i = 0;
        let id = body.id
        console.log(body.id)
        for (i = 0; i < appdata.length; i++){
          if (appdata[i].includes("" + id)){
            appdata.splice(i, 1)
          }
        }
        break;
        
      case "edit":
        console.log("edit")
        let k = 0;
        let j = body.id
        var editWord = ""
        for (k = 0; k < appdata.length; k++){
          if (appdata[k].includes("" + j)){
            editWord = JSON.parse(appdata[k]).word
            appdata.splice(k, 1)
          }
        }
        //console.log(editWord)
        let editedLoad = {word:editWord, lang: body.lang, translation: "", action: body.action, id:body.id};
        translateWord(editWord, body.lang).then(function(retVal){
            editedLoad.translation += retVal;
            res.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
            appdata.push(JSON.stringify(editedLoad));
            console.log(appdata)
            res.end(JSON.stringify(editedLoad));
          });
        break;
    }
    //end of switch case
  })
  //end of datastream
})

app.post('/login', function (req, res) {
  res.send('POST request to the homepage')
})

app.post('/queryLogin', function (req, res) {
  res.end(currentSession)
})

const adapter = new FileAsync('db.json')
low(adapter)
  .then(db => {
    // Routes
    // GET /posts/:id
    app.get('/posts/:id', (req, res) => {
      const post = db.get('posts')
        .find({ id: req.params.id })
        .value()

      res.send(post)
    })

    // POST /posts
    app.post('/posts', (req, res) => {
      db.get('posts')
        .push(req.body)
        .last()
        .assign({ id: Date.now().toString() })
        .write()
        .then(post => res.send(post))
    })

    // Set db default values
    return db.defaults({ posts: [] }).write()
  })
  .then(() => {
    app.listen(3000, () => console.log('listening on port 3000'))
  })
