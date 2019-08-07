const pgp = require('pg-promise')(); 
var db = pgp('postgres://ejhivrfxrvzsam:e6ea27848d6af9115aa2c68040e674502dbfb9d288840cac04cbda3e90607967@ec2-107-20-167-241.compute-1.amazonaws.com:5432/d80ue59kfg9h7u?ssl=true');

function getAllPerson(req, res) {
   // console.log("req = "+req.params.idp);
    
    db.any('select * from persons').then(function (data) {
        res.status(200).json({
         status: 'success',
         data: data,
          message: 'Retrieved ALL products'
        });
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({
            status: 'failed',
            data: data,
            message: 'Failed To Retrieved ALL products'
        });
    })
}

function getPerson(req, res) {
    // console.log("req = "+req.params.idp);
     
     db.any('select * from persons where personid = '+ req.params.id).then(function (data) {
         res.status(200).json({
          status: 'success',
          data: data,
           message: 'Retrieved ALL products'
         });
     }).catch(function (error) {
         console.log(error);
         res.status(500).json({
             status: 'failed',
             data: data,
             message: 'Failed To Retrieved ALL products'
         });
     })
 }


    module.exports = { 
        getAllPerson,
        getPerson
    }