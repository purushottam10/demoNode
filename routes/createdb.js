const nano = require("nano")

exports.create = function(req,res){
    nano.bind.create(req.body.dbName,function(){
       if(err){
           res.send("error to create the Database ");
           return;
       }
       res.send("database crated successfully " + req.body.dbName);
    });
};