const { connection } = require('../config')
const { slotStatus } = require('../dataEnum')



const isCarSize = (car_size) => {
    return new Promise(async (resolve, reject) => {
        let param = { field: "car_size", value: car_size }
        let dataFind = await find(param)
        if (dataFind.length > 0) {
            resolve(true)
        } else {
            resolve(false)
        }
    })
}
const find = (condition = null) => {
    let sql = " SELECT * FROM parking_slot "
    let strSql = sql;

    if (condition) {
        const { field, value } = condition
        sql += " WHERE ?? = ? "
        strSql = connection.format(sql, [field, value])
    }
    console.log("strSql => ", strSql)
    return new Promise((resolve, reject) => {
        connection.query(strSql, (err, res) => {
            if (err) {
                console.log("err => ", err)
                return reject(err)
            }
            console.log("res => ", res)
            resolve(res)
        })
    })
}

const update = (param) => {
    const { id, ..._param } = param

    let sql = connection.format("UPDATE parking_slot SET ? WHERE id = ?", [_param, id])
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, res) => {
            if (err) {
                return reject(err)
            }
            resolve(res)
        })
    })
}

const findDetail = (carSlotDetailId) => {
    return new Promise((resolve, reject) => {
        let sql = " SELECT d.id, d.car_size_id , s.car_size , d.name , d.status , s.unit_max , s.unit_remaining "
        sql += " FROM parking_slot s JOIN parking_slot_detail d on s.id = d.car_size_id WHERE d.id = ? "
        connection.query(sql, [carSlotDetailId], (err, results) => {
            if (err) {
                console.log("err=> ", err)
                return reject(err)
            }
            if (results.length == 1) {
                return resolve(results[0])
            }
            reject("Not Data")
        })
    })
}

const findAllocated = (carSize) => {
    return new Promise((resolve, reject) => {
        let sql = " SELECT d.id, d.car_size_id , s.car_size , d.name , d.status , s.unit_remaining"
        sql += " FROM parking_slot s JOIN parking_slot_detail d on s.id = d.car_size_id "
        sql += " WHERE d.status = ? AND s.car_size = ?"
        sql += " ORDER BY d.id ASC "
        connection.query(sql, [slotStatus.waiting, carSize], (err, results) => {
            if (err) {
                return reject(err)
            }
            resolve(results)
        })
    })
}

const findDetailByCarSize = (car_size) => {
    return new Promise((resolve, reject) => {
        let sql = " SELECT d.id, d.car_size_id , s.car_size , d.name , d.status "
        sql += " FROM parking_slot s JOIN parking_slot_detail d on s.id = d.car_size_id WHERE s.car_size = ? "
        connection.query(sql, [car_size], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}



const insertData = (carSize, unit) => {
    return new Promise((resolve, reject) => {
        connection.query({
            sql: "INSERT INTO parking_slot (car_size,unit_max) VALUES (?,?)",
            values: [carSize, unit],
        }, (err, results) => {
            if (err) reject(err)
            console.log("result => ", results)
            resolve(results)
        })
    })
}

const insertDataDetail = (car_size_id, name) => {
    return new Promise((resolve, reject) => {
        connection.query({
            sql: "INSERT INTO parking_slot_detail (car_size_id,name) VALUES (?,?)",
            values: [car_size_id, name],
        }, (err, results) => {
            if (err) {
                return reject(err)
            }
            resolve(results)
        })
    })
}

const updateParkingSlotDetail = (param) => {
    return new Promise((resolve, reject) => {
        const { id, ..._param } = param
        let sql = connection.format("UPDATE parking_slot_detail SET ? WHERE id = ?", [_param, id])
        console.log("updateParkingSlotDetail => sql => ", sql)
        connection.query(sql, (err, results) => {
            if (err) return reject(err);
            resolve(results)
        })
    })
}


module.exports = {
    isCarSize,
    find,
    findDetail,
    findDetailByCarSize,
    findAllocated,
    update,
    insertData,
    insertDataDetail,
    updateParkingSlotDetail,
}