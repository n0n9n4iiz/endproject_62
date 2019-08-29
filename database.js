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
    db.any('select * from persons where personid = ' + req.params.id).then(function (data) {
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


 async function addNewByUser(req, res) { 
    // var d = new Date();
    // var time = d.toLocaleDateString();
    var hn = req.body.hn;
    var no = req.body.no;
    var room = req.body.room;
    let date = req.body.date;
    let tdata
    let noplus
    //var time = req.body.time;
  await db.any("select no,date,room,hn from roomseq where hn = '"+hn+"' order by no").then(function (data) {
    tdata = data
    res.status(200)
    .json({
        status: 'success',
        message: 'Inserted one product'
    });

    }).catch(function (error) {
        console.log(error);
        res.status(500).json({
            status: 'failed',
            data: data,
            message: 'Failed To Retrieved ALL products'
        });
    })

    const check = await checkdate(date,tdata)

    //console.log("check ="+check);
   var count = 0;
    if(check == undefined){
        noplus = 1
    }else{
        for(var j =0;j<tdata.length;j++){
            if(check == tdata[j].date){
                count++
            }
        }
        noplus = count+1
    }
    
    for(i=0;i<tdata.length;i++){
        console.log(tdata[i])
    }
    db.any('insert into roomseq(hn, no, room, date)' +
        "values("+hn+","+noplus+",'"+room+"','"+date+"')")
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

async function checkdate(date,tdata){
   let result = await loopcheckdate(date,tdata)
     //console.log("result:"+result) // 
     return result 
}

function loopcheckdate(date,tdata) {
    let result
    for  ( let i = 0; i < tdata.length; i++) {
        if (tdata[i].date == date) {
           result = tdata[i].date
           break
        }
      }
      return result
}


async function getAllRoomseq(req, res) {
    let tdata
    await db.any('select * from roomseq').then(function (data) {
       tdata = data
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
    var id = req.query.id;
    var date = req.query.date;
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

 async function getMyactivityNextday(req, res) {
     
     let datedata;

    await db.any('SELECT date'+
' FROM persons'+
' INNER JOIN roomseq'+
" ON persons.hn = roomseq.hn where personid = "+req.query.id+" group by date order by date").then(function (data) {
    datedata = data
    var str = req.query.date;
  var adjustDate = str.substring(0, 1);
  var adjustDay
  var adjustMonth
  var nextCheck;
  if(adjustDate=="0"){
  adjustDate = str.substring(1, 10);
  var adjustDay = adjustDate.substring(2,4);
  var adjustMonth = adjustDate.substring(0,1);
  //var date = ["1/29", "1/30", "2/1"];
  var myday = [adjustDay]
  var mymonth = [adjustMonth]

  checknextdate()
  findnextdate()

  function findnextdate(){
  for (var z = 1; z < myday.length; z++) {
      console.log("day "+myday[z]);

  }
  for (var h = 1; h < mymonth.length; h++) {
      console.log("month "+mymonth[h]);

  }
  end:
     for(var w = 1;w<mymonth.length;w++){
          for(var q = 1;q<myday.length;q++){
              console.log("day "+myday[q]);
              console.log("month "+mymonth[w]);  
              for(var b = 0;b<datedata.length;b++){
                  if(myday[q]==datedata[b].date.substring(2,4)&&mymonth[w]==datedata[b].date.substring(0,1)){
                      console.log("---------------------found-------------------");
                      console.log(datedata[b].date);
                      nextCheck = datedata[b].date;
                      break end;
                  }else{
                      console.log("not found");
                  }
              }
          }
      }
   }
  function checknextdate() {

      if (myday[0] == 28 && mymonth[0] == 2) {
          console.log("A");
          myday.length = 1
          for (var k = 1; k < 32; k++) {
              myday.push(k);
          }

      } else if (myday[0] == 30 && (mymonth[0] == 4 || mymonth[0] == 6 || mymonth[0] == 9 || mymonth[0] == 11)) {
          console.log("B");
          myday.length = 1
          for (var k = 1; k < 32; k++) {
              myday.push(k);
          }
          
          for (var o = 1; o < 13; o++) {
              if (mymonth[0] == o) {
                  for (var u = o+1; u < 13; u++) {
                      mymonth.push(u);
                  }
                  break
              }
          }

      } else if (myday[0] == 31 && (mymonth[0] == 1 || mymonth[0] == 3 || mymonth[0] == 5 || mymonth[0] == 7 || mymonth[0] == 8 || mymonth[0] == 10 || mymonth[0] == 12)) {
          console.log("C");
          myday.length = 1
          for (var k = 1; k < 32; k++) {
              myday.push(k);
          }
          for (var o = 1; o < 13; o++) {
              if (mymonth[0] == o) {
                  for (var u = o+1; u < 13; u++) {
                      mymonth.push(u);
                  }
                  break
              }
          }

      } else {
          console.log("else");
          for (var j = 1; j < 32; j++) {
              if (myday[0] == j) {
                  for (var t = j+1; t < 32; t++) {
                      myday.push(t);
                  }
                  break
              }
          }

          for (var o = 1; o < 13; o++) {
              if (mymonth[0] == o) {
                  for (var u = o; u < 13; u++) {
                      mymonth.push(u);
                  }
                  break
              }
          }

      }

  }
  //adjustDate = adjustDate.substring(0,1);
//   adjustDate = parseInt(adjustDate)+1

//   for(var i = 0;i<datedata.length;i++){
//     if(adjustDate==datedata[i].date.substring(0,1)){
//         console.log("found = "+datedata[i].date);
//         nextMonthCheck = datedata[i].date;
//         break;      
//     }
// } 
  }else{
  adjustDate = str.substring(0, 10);

  }

db.any('SELECT  no,room,date,roomseq.hn'+
' FROM persons'+
' INNER JOIN roomseq'+
" ON persons.hn = roomseq.hn where personid = "+req.query.id+" and date like '"+nextCheck+"%' order by no").then(function (data) {
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
}).catch(function (error) {
    console.log(error);
    res.status(500).json({
        status: 'failed',
        data: data,
        message: 'Failed To Retrieved ALL products'
    });
})
    
//   var str = req.query.date;
//   var adjustDate = str.substring(0, 1);
//   var nextMonthCheck;
//   if(adjustDate=="0"){
//   adjustDate = str.substring(1, 10);
// //   console.log(adjustDate);
//   adjustDate = adjustDate.substring(0,1);
//   adjustDate = parseInt(adjustDate)+1
// //   console.log(adjustDate);
//   for(var i = 0;i<datedata.length;i++){
//     if(adjustDate==datedata[i].date.substring(0,1)){
//         console.log("found = "+datedata[i].date);
//         nextMonthCheck = datedata[i].date;
//         break;      
//     }
// } 
//   }else{
//   adjustDate = str.substring(0, 10);

//   }

// db.any('SELECT  no,room,date,roomseq.hn'+
// ' FROM persons'+
// ' INNER JOIN roomseq'+
// " ON persons.hn = roomseq.hn where personid = "+req.query.id+" and date like '"+nextMonthCheck+"%' order by no").then(function (data) {
//   res.status(200).json( 
//          data      
//   );
// }).catch(function (error) {
//   console.log(error);
//   res.status(500).json({
//       status: 'failed',
//       data: data,
//       message: 'Failed To Retrieved ALL products'
//   });
// })

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
    getHistoryItem,
    getMyactivityNextday
}