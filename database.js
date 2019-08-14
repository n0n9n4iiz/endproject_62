const pgp = require('pg-promise')();
var db = pgp('postgres://ejhivrfxrvzsam:e6ea27848d6af9115aa2c68040e674502dbfb9d288840cac04cbda3e90607967@ec2-107-20-167-241.compute-1.amazonaws.com:5432/d80ue59kfg9h7u?ssl=true');

function getAllPerson(req, res) {
    db.any('select * from persons').then(function (data) {
        res.status(200).json(  
             data
        
        );
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
    db.any('select * from persons where hn = ' + req.params.id).then(function (data) {
        res.status(200).json( 
               data      
        );
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({
            status: 'failed',
            data: data,
            message: 'Failed To Retrieved ALL products'
        });
    })
}

function insertRoomSeq(req, res) {
    console.log(req.body);
    var hn = req.body.hn;
    var no = req.body.no;
    var room = req.body.room;
    var date = req.body.date;
    var time = req.body.time;

    
    db.any('insert into roomseq(hn, no, room, date, time)' +
        "values("+hn+","+no+",'"+room+"','"+date+"','"+time+"')")
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Inserted one product'
                });
        })
        .catch(function (error) {
            console.log('ERROR:', error)
        })
}
function getRoomSeqHn(req, res) {
   
    db.any('SELECT roomseq.hn, no, room, date '+
        'FROM persons '+
        'INNER JOIN roomseq '+
        'ON persons.hn = roomseq.hn where personid = '+req.params.id).then(function (data) {
        res.status(200).json(
               data   
        );
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({
            status: 'failed',
            data: data,
            message: 'Failed To Retrieved ALL products'
        });
    })
}
function getMyactivitytoday(req, res) {
    db.any('SELECT  no,room,date'+
    ' FROM persons'+
    ' INNER JOIN roomseq'+
    " ON persons.hn = roomseq.hn where personid = "+req.params.id+" and date like '"+req.params.date+"%'").then(function (data) {
        res.status(200).json( 
               data      
        );
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
    getPerson,
    insertRoomSeq,
    getRoomSeqHn,
    getMyactivitytoday
}