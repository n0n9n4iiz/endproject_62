var express = require('express');
var app = express();
var db = require('./database'); 
var bodyParser = require('body-parser');
var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: true
}));

app.get('/', function (req, res) {
    res.send('Express is running');
});

app.get('/allperson',db.getAllPerson);

app.get('/allroomseq',db.getAllRoomseq);

app.get('/historybydate/:id',db.getHistoryByDate)

app.get('/historyItem/',db.getHistoryItem)

app.get('/getperson/:id',db.getPerson);

app.post('/roomseq', db.insertRoomSeq);

app.post('/roomseq/addnew', db.addNewByUser); 

app.get('/roomseq/:id' ,db.getRoomSeqHn);

app.get('/roomseq/' ,db.getMyactivitytoday);

app.delete('/roomseq/deleteRoomseq/',db.deleteRoomseqByNo);

app.get('/nextday/roomseq/' ,db.getMyactivityNextday);

app.patch('/getSuccess/',db.getSuccessByUser);

app.get('/getDateMeet/' , db.getDateMeet);

//get with id later
app.get('/hisyear' , db.getYearHisbyId);
//get id and year from hisyear
app.get('/hismonth/' , db.getMonthHisbyId);
//get id and month from his month
app.get('/hisgroupmoth/' , db.getDayHisbyId);

//app.get('/hisitem/' , db.getItemHisById );
app.get('/MeetDateByAll/' ,db.getMeetByall);

app.get('/allMeetDate/' ,db.allMeetDate);

app.get('/hislist/' , db.hislist );
//web change name
app.patch('/editnameroom/' ,db.changeRoom);

app.get('/gethn/:id' , db.checkHN);

var port = process.env.PORT || 8080;
app.listen(port, function () {
console.log('App is runnb ing on http://localhost:' + port);
});    