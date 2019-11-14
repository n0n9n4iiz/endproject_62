const pgp = require('pg-promise')();
var db = pgp('postgres://ejhivrfxrvzsam:e6ea27848d6af9115aa2c68040e674502dbfb9d288840cac04cbda3e90607967@ec2-107-20-167-241.compute-1.amazonaws.com:5432/d80ue59kfg9h7u?ssl=true');
function getLogin(req, res) {
    var id = req.query.id;
    var bdate = req.query.bdate;
    db.any("select * from persons where personid = " + id + " and birthdate = '" + bdate + "'").then(function (data) {
        res.status(200).json(
            data
        )
    }).catch(function (err) {
        res.status(500).json(
            err
        )
    })
}
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

    var hn = req.body.hn;
    var no = req.body.no;
    var room = req.body.room;
    var date = req.body.date;
    var time = req.body.time;
    console.log(hn);
    console.log(no);
    console.log(room);
    console.log(date);
    console.log(time);
    db.any('insert into roomseq(hn, no, room, date, time)' +
        "values(" + hn + "," + no + ",'" + room + "','" + date + "','" + time + "')")
        .then(function (data) {

        })
        .catch(function (error) {
            console.log('ERROR:', error)
        })
}
function getRoomSeqHn(req, res) {

    db.any('SELECT roomseq.hn, no, room, date ' +
        'FROM persons ' +
        'INNER JOIN roomseq ' +
        'ON persons.hn = roomseq.hn where personid = ' + req.params.id).then(function (data) {
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

    db.any('SELECT  no,room,date,roomseq.hn,success' +
        ' FROM persons' +
        ' INNER JOIN roomseq' +
        " ON persons.hn = roomseq.hn where personid = " + req.query.id + " and date like '" + req.query.date + "%' order by no").then(function (data) {
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
    var hn = req.query.hn;
    var no = req.query.no;
    var date = req.query.date;

    db.any('DELETE FROM roomseq WHERE hn = ' + hn + " and date = '" + date + "' and no=" + no + ';').then(function () {
        db.any('select * from roomseq WHERE hn = ' + hn + " and date = '" + date + "' order by no;").then(function (data) {
            //for x>1
            for (var i = 0; i < data.length; i++) {
                if (data[i].no != (i + 1)) {
                    db.any('update roomseq set no = ' + (i + 1) + " where no=" + data[i].no).then(function () {
                    }).catch(function (err) {
                        res.status(500).json({
                            err
                        });
                    })

                }
            }
            setTimeout(function () {
                db.any('select * from roomseq WHERE hn = ' + hn + " and date = '" + date + "' order by no;").then(function (data) {
                    res.status(200).json(
                        data
                    )
                }).catch(function (err) {
                    err
                })
            }, 2000)

        }).catch(function (err) {
            res.status(500).json({
                err
            });
        })

    }).catch(function (error) {

        res.status(500).json({
            error
        });
    })
}



async function addNewByUser(req, res) { //try
    var hn = req.body.hn;
    var room = req.body.room;
    let date = req.body.date;
    let noplus

    await db.any("select no,date,room,hn from roomseq where hn = '" + hn + "' and date ='" + date + "' order by no").then(function (data) {

        if (data.length == 0) {
            noplus = 1
        } else {
            noplus = (data.length + 1)
        }
        db.any('insert into roomseq(hn, no, room, date)' +
            "values(" + hn + "," + noplus + ",'" + room + "','" + date + "')")
            .then(function (data) {
                res.status(200).json({
                    success: "success"
                })

            })
            .catch(function (error) {
                console.log('ERROR:', error)
            })
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({
            status: 'failed',
            data: data,
            message: 'Failed To Retrieved ALL products'
        });
    })
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
    var today = new Date();
    var mm = today.getMonth() + 1;
    var dd = today.getDate();
    var yyyy = today.getFullYear();
    if (mm == 1 || mm == 2 || mm == 3 || mm == 4 || mm == 5 || mm == 6 || mm == 7 || mm == 8 || mm == 9) {
        mm = "0" + mm
    }
    if (dd == 1 || dd == 2 || dd == 3 || dd == 4 || dd == 5 || dd == 6 || dd == 7 || dd == 8 || dd == 9) {
        dd = "0" + dd
    }
    var fDate = dd + '/' + mm + '/' + yyyy;
    console.log(fDate);
    db.any('SELECT date ' +
        'FROM persons ' +
        'INNER JOIN roomseq ' +
        'ON persons.hn = roomseq.hn ' +
        'where personid = ' + req.params.id + ' group by date order by substring(date, 7, 10),substring(date, 4, 5),substring(date,1,2)').then(function (data) {
            var datadate = data;
            var arrsetdate = []
            //check history  since yesterday
            for (var i = 0; i < datadate.length; i++) {
                var date = {}
                if (parseInt(datadate[i].date.substring(6, 10)) < parseInt(yyyy)) {
                    console.log(datadate[i].date);
                    arrsetdate.push(Object.assign(date, { date: datadate[i].date }));
                }
                if (parseInt(datadate[i].date.substring(6, 10)) == parseInt(yyyy)) {
                    if (parseInt(datadate[i].date.substring(3, 5)) < parseInt(mm)) {
                        console.log(datadate[i].date);
                        arrsetdate.push(Object.assign(date, { date: datadate[i].date }));
                    } else if (parseInt(datadate[i].date.substring(3, 5)) == parseInt(mm)) {
                        if (parseInt(datadate[i].date.substring(0, 2)) < parseInt(dd)) {
                            console.log(datadate[i].date);
                            arrsetdate.push(Object.assign(date, { date: datadate[i].date }));
                        }
                    }
                }
            }

            // arrsetdate.push(Object.assign(date, { date: datadate[i].date }));


            res.status(200).json(
                arrsetdate
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
    db.any('SELECT no,room,date ' +
        'FROM persons ' +
        'INNER JOIN roomseq ' +
        'ON persons.hn = roomseq.hn ' +
        "where personid = " + id + " and date like '" + date + "%' order by no").then(function (data) {
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

    await db.any('SELECT date' +
        ' FROM persons' +
        ' INNER JOIN roomseq' +
        " ON persons.hn = roomseq.hn where personid = " + req.query.id + " group by date order by date").then(function (data) {
            datedata = data
            var str = req.query.date;
            var adjustDay
            var adjustMonth
            var nextCheck;

            var adjustDay = str.substring(0, 2);
            var adjustMonth = str.substring(3, 5);

            var myday = [adjustDay]
            var mymonth = [adjustMonth]

            checknextdate()
            findnextdate()

            function findnextdate() {
                for (var z = 1; z < myday.length; z++) {
                    console.log("day " + myday[z]);

                }
                for (var h = 1; h < mymonth.length; h++) {
                    console.log("month " + mymonth[h]);

                }
                end:
                for (var w = 1; w < mymonth.length; w++) {
                    for (var q = 1; q < myday.length; q++) {
                        console.log("day " + myday[q]);
                        console.log("month " + mymonth[w]);
                        for (var b = 0; b < datedata.length; b++) {
                            if (myday[q] == datedata[b].date.substring(0, 2) && mymonth[w] == datedata[b].date.substring(3, 5)) {
                                console.log("---------------------found-------------------");
                                console.log(datedata[b].date);
                                nextCheck = datedata[b].date;
                                break end;
                            } else {
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
                            for (var u = o + 1; u < 13; u++) {
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
                            for (var u = o + 1; u < 13; u++) {
                                mymonth.push(u);
                            }
                            break
                        }
                    }

                } else {
                    console.log("else");
                    for (var j = 1; j < 32; j++) {
                        if (myday[0] == j) {
                            for (var t = j + 1; t < 32; t++) {
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
            db.any('SELECT  no,room,date,roomseq.hn,success' +
                ' FROM persons' +
                ' INNER JOIN roomseq' +
                " ON persons.hn = roomseq.hn where personid = " + req.query.id + " and date like '" + nextCheck + "%' order by no").then(function (data) {
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
}

function getSuccessByUser(req, res) {
    var hn = req.query.hn;
    var no = req.query.no;
    var date = req.query.date;
    var suc = req.body.success;

    db.any("update roomseq set success = '" + suc + "' where hn = " + hn + " and no = " + no + " and date = '" + date + "'").then(function (data) {
        res.status(200).json(
            "Update success"
        );
    }).catch(function (error) {
        res.status(500).json("Update fail")
    })
}

function getDateMeet(req, res) {
    db.any("select roomseq.hn,no,room,date from persons " +
        "inner join roomseq " +
        "on persons.hn = roomseq.hn " +
        "where personid = " + req.query.id + " and date = '" + req.query.date + "' " +
        "order by substring(date, 7, 10),substring(date, 4, 5),substring(date,1,2)").then(function (data) {
            res.status(200).json(
                data
            )
        }).catch(function (err) {
            res.status(500).json("fail " + err)
        })
}
//for test
function getYearHisbyId(req, res) {
    var dataset;
    var arrget = [];
    var today = new Date();
    var yyyy = today.getFullYear();
    var fDate = yyyy;
    db.any("select substring(date,7,10) as year " +
        "from persons " +
        "inner join roomseq " +
        "on persons.hn = roomseq.hn " +
        "where personid = " + req.query.id + " " +
        "group by year").then(function (data) {
            dataset = data;
            for (var i = 0; i < dataset.length; i++) {
                var year = {}
                if (parseInt(dataset[i].year) <= parseInt(yyyy)) {
                    arrget.push(Object.assign(year, { year: dataset[i].year }));
                }
            }

            res.status(200).json(
                arrget
            )
        }).catch(function (err) {
            res.status(500).json("fail " + err)
        })
}

function getMonthHisbyId(req, res) {
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = today.getMonth() + 1;
    if (mm == 1 || mm == 2 || mm == 3 || mm == 4 || mm == 5 || mm == 6 || mm == 7 || mm == 8 || mm == 9) {
        mm = "0" + mm
    }
    var dataset
    var arrget = [];
    var year = req.query.year;
    db.any('select substring(date,4,2) as month ' +
        'from persons ' +
        'inner join roomseq ' +
        'on persons.hn = roomseq.hn ' +
        "where personid = '" + req.query.id + "' and substring(date,7,4) = '" + year + "' " +
        'group by month').then(function (data) {
            dataset = data;
            for (var i = 0; i < dataset.length; i++) {
                var month = {}
                if (parseInt(year) < parseInt(yyyy)) {
                    arrget.push(Object.assign(month, { month: dataset[i].month }))
                } else if (parseInt(year) == parseInt(yyyy)) {
                    if (parseInt(dataset[i].month) <= parseInt(mm)) {
                        arrget.push(Object.assign(month, { month: dataset[i].month }))
                    }
                }
            }
            res.status(200).json(
                arrget
            )
        }).catch(function (err) {
            res.status(500).json("fail " + err)
        })
}

function getDayHisbyId(req, res) {
    var today = new Date();
    var mm = today.getMonth() + 1;
    var dd = today.getDate();
    var yyyy = today.getFullYear();
    if (mm == 1 || mm == 2 || mm == 3 || mm == 4 || mm == 5 || mm == 6 || mm == 7 || mm == 8 || mm == 9) {
        mm = "0" + mm
    }
    if (dd == 1 || dd == 2 || dd == 3 || dd == 4 || dd == 5 || dd == 6 || dd == 7 || dd == 8 || dd == 9) {
        dd = "0" + dd
    }
    var year = req.query.year;
    var month = req.query.month;

    var arrget = [];
    db.any("select date from roomseq " +
        "inner join persons " +
        "on roomseq.hn = persons.hn " +
        "where personid = '" + req.query.id + "' and date like '%/" + month + "/" + year + "' " +
        "group by date").then(function (data) {
            for (var i = 0; i < data.length; i++) {
                var datebf = {}
                if (year < yyyy) {
                    arrget.push(Object.assign(datebf, { date: data[i].date }))
                } else if (year == yyyy) {
                    if (month < mm) {
                        arrget.push(Object.assign(datebf, { date: data[i].date }))
                    } else if (month == mm) {
                        if (parseInt((data[i].date).substring(0, 2)) < parseInt(dd)) {
                            arrget.push(Object.assign(datebf, { date: data[i].date }))
                        }
                    }
                }
            }
            res.status(200).json(
                arrget
            )
        }).catch(function (err) {
            res.status(500).json("fail " + err)
        })
}

function getItemHisById(req, res) {
    var id = req.query.id;
    var date = req.query.date;
    var dataset;
    db.any("select roomseq.hn,no,room,date " +
        "from roomseq " +
        "inner join persons " +
        "on roomseq.hn = persons.hn " +
        "where personid = " + id + " and date = '" + date + "' order by no").then(function (data) {
            dataset = data

            res.status(200).json(
                data
            )
        }).catch(function (err) {
            res.status(500).json(
                "fail " + err
            )
        })
}

function allMeetDate(req, res) {
    var arrset = [];
    var today = new Date();
    var mm = today.getMonth() + 1;
    var dd = today.getDate();
    var yyyy = today.getFullYear();
    if (mm == 1 || mm == 2 || mm == 3 || mm == 4 || mm == 5 || mm == 6 || mm == 7 || mm == 8 || mm == 9) {
        mm = "0" + mm
    }
    if (dd == 1 || dd == 2 || dd == 3 || dd == 4 || dd == 5 || dd == 6 || dd == 7 || dd == 8 || dd == 9) {
        dd = "0" + dd
    }
    db.any('select date from roomseq inner join persons on roomseq.hn = persons.hn where personid = ' + req.query.id + ' group by date order by substring(date, 7, 10),substring(date, 4, 5),substring(date,1,2)')
        .then(function (data) {
            for (var i = 0; i < data.length; i++) {
                var currdate = {}
                day = (data[i].date).substring(0, 2);
                month = (data[i].date).substring(3, 5)
                year = (data[i].date).substring(6, 10)

                if (year == yyyy) {
                    if (month > mm) {
                        arrset.push(Object.assign(currdate, { date: data[i].date }))
                    } else if (month == mm) {
                        if (day > dd) {
                            arrset.push(Object.assign(currdate, { date: data[i].date }))
                        }
                    }
                } else if (year > yyyy) {
                    arrset.push(Object.assign(currdate, { date: data[i].date }))
                }
            }

            res.status(200).json(
                arrset
            )
        }).catch(function (err) {
            res.status(500).json(
                err
            )
        })

}
function getMeetByall(req, res) {
    db.any("select no,room from roomseq inner join persons on roomseq.hn = persons.hn where personid = " + req.query.id + " and date = '" + req.query.date + "' order by no").then(function (data) {
        res.status(200).json(
            data
        )
    }).catch(function (err) {
        res.status(500).json(
            err
        )
    })
}

function hislist(req, res) {
    db.any("select * from roomseq inner join persons on persons.hn = roomseq.hn where personid =" + req.query.id + " and date = '" + req.query.date + "' order by no").then(function (data) {
        res.status(200).json(
            data
        )
    }).catch(function (err) {
        res.status(500).json(
            err
        )
    })
}

function changeRoom(req, res) {

    var oldname = req.body.oldname;
    var newname = req.body.newname;

    db.any('update public."point_v1" set p_name = ' + "'" + newname + "'" + " where p_name = '" + oldname + "'").then(function (data) {

    }).catch(function (err) {
        res.status(500).json(
            err
        )
    })
}
function checkHN(req, res) {
    var id = req.params.id
    db.any("select hn from persons where personid = " + id).then(function (data) {
        res.status(200).json(
            data
        )
    }).catch(function (err) {
        res.status(500).json(
            err
        )
    })
}
function delGroupdate(req, res) {
    var hn = req.query.hn;
    var date = req.query.date;
    db.any("delete from roomseq where hn= " + hn + " and date = '" + date + "'").then(function (data) {
        res.status(200).json(
            'success'
        )
    }).catch(function (err) {
        res.status(500).json(
            err
        )
    })
}


module.exports = {
    getLogin,
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
    getMyactivityNextday,
    getSuccessByUser,
    getDateMeet,
    getYearHisbyId,
    getMonthHisbyId,
    getDayHisbyId,
    getItemHisById, // ใช้ในปัจจุบัน
    allMeetDate,
    hislist,
    getMeetByall,
    changeRoom,
    checkHN,
    delGroupdate
}