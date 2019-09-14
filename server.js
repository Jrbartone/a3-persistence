// server.js
// where your node app starts

// init project
const express = require('express')
const bodyParser = require('body-parser')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const app = express();
app.use(bodyParser.json())

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


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

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
