const{promisify} = require('util')
const mysql= require('mysql')
const{database} = require('./keys')
const pool = mysql.createPool(database);
pool.getConnection((err,connection)=>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.log('DATABASE CONNECTION CLOSED')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
          console.log('DATABASE HAS TO MANY CONNECTIONS')
        }
        if (err.code === 'ECONNREFUSED') {
          console.log('DATABASE CONNECTION WAS REFUSED')
        }
    }

        if(connection) connection.release();
        console.log('DB is Connected');
        return;

})
//Promisify pool query
pool.query = promisify(pool.query);
module.exports = pool;
