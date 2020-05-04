const mysql = require('mysql')
const dbConfig = {
    host: '',
    user: '',
    password: '',
    database: ''
}

const connection = mysql.createConnection(dbConfig)

module.exports = {
    connection,
    dbConfig
}