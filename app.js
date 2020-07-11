module.exports = app;
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path')
var urlencoded = require('url');
var bodyParser = require('body-parser')
var json = require('json');
var logger = require('logger');
const { create } = require('domain');
var methodOverride = require('method-override');
var jade = require('jade')

var nano = require('nano')('http://localhost:5948');
var db = nano.use('address');
var app = express();
var express = require('express');

app.set('port',process.env.PORT || 3000);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(express.static(path.join(__dirname,'public')));

app.get('/',routes.index);

app.post('/createdb',function(req,res){
    nano.db.create(req.body.dbName,function(err){
        if(err){
            res.send("Error creating Database " + req.body.dbName);
            return;
        }
        res.send("Database" + req.body.dbname + "created Sucessfully");
    })
});

app.post('/new_contact',function(req,res){
    var name = req.body.name;
    var phone =req.body.phone;
    db.insert({name:name,phone:phone,crazy:true},phone,function(err,body,header){
        if(err){
            res.send("Error while create Contact " + phone);
            return;
        }
        res.send("Contact created Sucessfully");
    });
});

app.post('/view_contact',function(req,res){
    var allDoc= "Following are the Contacts";
    db.get(req.body.phone,{revs_info:true},function(err,body){
        if(!err){
            console.log(body)
        } 
        if(body){
            allDoc + " Name :" + body.name + "<br/> Phone Number : " + body.phone;
        } else{
           allDoc + " No data Found ";
        }
        res.send(allDoc);
    });
});

app.post('/delete_contact',function(req,res){
    db.get(req.body.phone,{revs_info:true},function(err,body){
        if(!err){
            db.destroy(req.body.phone,body._rev,function(err,body){
              if(err){
                  res.send("error deleteing Contact");
              }  
            });
            res.send("Contacts deleted sucessfully");
        }
    })
})

http.createServer(app).listen(app.get('port'),function(){
    console.log('Express server listening on port ' + app.get('port'));
});

