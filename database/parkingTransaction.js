const { connection } = require('../config')



const find = (condition = null) => {

    let sql = "SELECT * FROM parking_transaction t "
    sql += " JOIN parking_slot s ON t.car_size_id = s.id "
    let strSql = sql;

    if (condition) {
        const { field, value } = condition
        sql += " WHERE ?? = ?"
        strSql = connection.format(sql, [field, value])
    }
    console.log("strSql => ", strSql)

    return new Promise((resolve, reject) => {
        connection.query(strSql, (err, res) => {
            if (err) {
                return reject(err)
            }
            resolve(res)
        })
    })
}

const update = (param) => {
    const { ticket_id, ..._param } = param

    let sql = connection.format("UPDATE parking_transaction SET ? WHERE ticket_id = ?", [_param, ticket_id])
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, res) => {
            if (err) {
                return reject(err)
            }
            resolve(res)
        })
    })
}

const insert = (param) => {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO parking_transaction SET ?', param, (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
    })
}

module.exports = {
    find,
    update,
    insert
}