var express = require('express');
var router = express.Router();

var fs = require("fs");
var file = "./db/chinook.db";
var exists = fs.existsSync(file);
const sqlite3 = require('sqlite3').verbose();
var db;
const LOGIN_ERROR = "-1"
db =  new sqlite3.Database('./db/chinook.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
      console.error(err.message);
    }
    console.log("test users");
  }
 
);

async function getPlayList(){
 const res = await new Promise((resolve, reject) => {
    db.all('SELECT  playlist_id , name FROM playlist', [], (err, row) => {
        let data="<ul>";
        if (err)
            reject(err)
        let i=0;
        for(i=0;i<row.length;i++) 
         { 
          console.log(row[i].playlist_id+": "+row[i].name);
          data+= '<li>'+row[i].playlist_id + ": " + row[i].name+'</li>';
        }
        data+="</ul>s"
        resolve(data)
    })
})
console.log(res);
return res;
}


async function login(name,pwd){
  const res = await new Promise((resolve, reject) => {
     db.all("SELECT  * FROM employee where first_name like '"+name+"' and last_name like'"+pwd+"'", [], (err, row) => {
         if (err)
             reject(err)
         let i=0;
         data ="";
         if (row &&row.length>0)
          { 
            data= JSON.stringify(row,null, 2);
         }
        else{
           data=LOGIN_ERROR;
        }
         resolve(data)
     })
 })
 console.log(res);
 return res;
 }

/* GET palylist listing. */
router.get('/', async function(req, res, next) {
  var playlist = await getPlayList()
  res.send("<html><body>"+playlist+"</body></html>");
  
});

router.get('/login', async function(req, res, next) {
  let name=req.query.name||"";
  let pwd =req.query.pwd ||""; 
  if (name.length>0&&pwd.length>0)
  {
    var data = await login(name,pwd);
    if (data !=LOGIN_ERROR)
         {
           return res.send("<html><body><h1>Wellcome"+data+"</h1></body></html>");
         }
  }
  
  res.send("<html><body><h1>error en login password</h1></body></html>");
  
});

module.exports = router;
