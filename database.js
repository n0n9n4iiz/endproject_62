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
    
        var str = req.query.date;
        var adjustDate = str.substring(0, 1);
        if(adjustDate=="0"){
        adjustDate = str.substring(1, 10);
        }else{
        adjustDate = str.substring(0, 10);
        }
      
    db.any('SELECT  no,room,date,roomseq.hn'+
    ' FROM persons'+
    ' INNER JOIN roomseq'+
    " ON persons.hn = roomseq.hn where personid = "+req.query.id+" and date like '"+adjustDate+"%' order by no").then(function (data) {
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

function deleteRoomseqByNo(req, res) {
db.any('DELETE FROM roomseq WHERE hn = '+req.query.hn+" and date = '"+req.query.date+"' and no="+req.query.no+';').then(function (data) {
    res.status(200).json( 
        
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

function addNewByUser(req, res) {
    // var d = new Date();
    // var time = d.toLocaleDateString();
    var hn = req.body.hn;
    var no = req.body.no;
    var room = req.body.room;
    var date = req.body.date;
    //var time = req.body.time;
    db.any('insert into roomseq(hn, no, room, date)' +
        "values("+hn+","+no+",'"+room+"','"+date+"')")
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
function getAllRoomseq(req, res) {
    db.any('select * from roomseq').then(function (data) {
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
function getHistoryByDate(req, res) {
    db.any('SELECT date '+
    'FROM persons '+
    'INNER JOIN roomseq '+
    'ON persons.hn = roomseq.hn '+
    'where personid = '+req.params.id+' group by date order by date').then(function (data) {
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

function getHistoryItem(req, res) {
    var id = req.body.id;
    var date = req.body.date;
    db.any('SELECT no,room,date '+
        'FROM persons '+
        'INNER JOIN roomseq '+
        'ON persons.hn = roomseq.hn '+
        "where personid = "+id+" and date like '"+date+"%' order by no").then(function (data) {
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
    getMyactivitytoday,
    deleteRoomseqByNo,
    addNewByUser,
    getAllRoomseq,
    getHistoryByDate,
    getHistoryItem
}