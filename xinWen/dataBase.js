/**
 * Created by Administrator on 2016/5/19.
 */

function dataBase(infoData){
    var mysql  = require('mysql');
    var Promise=require('Promise');
    var sendMailObject=require('./sendMail.js');
    var sendMail=sendMailObject.sendMail;
    var info=[];
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'node'
    });
    connection.connect();
    infoData.forEach(function(data){
         info.push(checkDataBase(connection,sendMail,data));
    });
   Promise.all(info).then(function(){
       connection.end();
   })
}

function checkDataBase(connection,sendMail,data){
    return new Promise(function(resolve,reject){
        var  userAddSql = 'select * from xinwen where id='+data.id;
        connection.query(userAddSql,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
            if(result.length!=0){
                console.log('数据已经存在');
            }else{
                var  userAddSql = 'insert into xinwen values(?,?,?,?)';
                var  userAddSql_Params=[data.id,data.title,data.href,data.content];
                connection.query(userAddSql,userAddSql_Params,function(err,result){
                    if(err){
                        console.log('[INSERT ERROR] - ',err.message);
                        return;
                    }
                    sendMail(data);
                    resolve();
                })
            }
        });
    })
}

module.exports.dataBase=dataBase;
module.exports.checkDataBase=checkDataBase;