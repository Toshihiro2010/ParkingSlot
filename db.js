const { connection } = require('./config')
const { statusEnum, slotStatus } = require('./dataEnum')
const { parkingSlotDB, parkingTransactionDB } = require('./database')




//1.1
const createParkSlot = (car_size, name) => {

    return new Promise((resolve, reject) => {
        connection.beginTransaction(async (err) => {
            try {
                let param = { field: "car_size", value: car_size }
                let infoParkings = await parkingSlotDB.find(param)
                console.log("infoParking =>", infoParkings)
                if (infoParkings.length == 0) {
                    return reject("not car size : " + car_size)
                }
                let infoParking = infoParkings[0]
                const {
                    id,
                    // car_size,
                    unit_max, unit_remaining
                } = infoParking
                const createParkSlotDetail = await parkingSlotDB.insertDataDetail(id, name)
                // console.log(" createParkSlotDetail => ", createParkSlotDetail)
                const { insertId } = createParkSlotDetail
                const paramUnitSlot = {
                    id: id,
                    unit_max: unit_max + 1,
                    unit_remaining: unit_remaining + 1
                }
                // console.log(" paramUnitSlot => ", paramUnitSlot)
                const updateUnitSlot = await parkingSlotDB.update(paramUnitSlot)
                // console.log(" updateUnitSlot => ", updateUnitSlot)
                const dataResponse = await parkingSlotDB.findDetail(insertId)
                connection.commit()
                resolve(dataResponse)

            } catch (error) {
                connection.rollback()
                reject(err)
            }
        })
    })
}

//1.2
const deleteParkSlot = (slotDetailId) => {

    return new Promise((resolve, reject) => {
        connection.beginTransaction(async (err) => {
            try {
                const slotDetail = await parkingSlotDB.findDetail(slotDetailId)

                let param = { id: slotDetailId, status: slotStatus.delete }
                let delDetail = await parkingSlotDB.updateParkingSlotDetail(param)

                const {
                    car_size_id,
                    unit_remaining, unit_max
                } = slotDetail
                let param2 = { id: car_size_id, unit_max: unit_max - 1, unit_remaining: unit_remaining - 1 }
                let updateSlot = await parkingSlotDB.update(param2)
                connection.commit()
                resolve(updateSlot)

            } catch (error) {
                connection.rollback()
                reject(err)
            }
        })
    })
}

//2
const insertTranSaction = (param) => {
    return new Promise((resolve, reject) => {
        connection.beginTransaction(async (err) => {
            if (err) { return reject(err) }

            try {
                const { car_size, plate_number } = param
                const param1 = { field: "car_size", value: car_size }


                let checked = await parkingSlotDB.isCarSize(car_size)
                if (!checked) {
                    return reject("not car size : " + car_size)
                }

                let allocatedDatas = await parkingSlotDB.findAllocated(car_size)

                if (allocatedDatas.length == 0) {
                    return reject("car size " + car_size + " Not remaining")
                }
                const {
                    id,
                    car_size_id,
                    name, status,
                    unit_remaining,
                } = allocatedDatas[0]
                console.log("unit_remaining => ", unit_remaining)
                const dataSet = {
                    car_size_id: car_size_id,
                    slot_detail_id: id,
                    plate_number,
                    status: statusEnum.pending
                }
                const insertTicket = await parkingTransactionDB.insert(dataSet)
                console.log('insertTicket=> ', insertTicket)
                const { insertId } = insertTicket
                const paramSlotDetail = {
                    id: id,
                    status: slotStatus.apply
                }
                const paramSlot = {
                    id: car_size_id,
                    unit_remaining: unit_remaining - 1
                }
                const updateSlotDetail = await parkingSlotDB.updateParkingSlotDetail(paramSlotDetail)
                const updateParkingSlot = await parkingSlotDB.update(paramSlot)
                connection.commit()
                resolve({ insertId })
            } catch (error) {
                connection.rollback()
                reject(error)
            }

        })
    })
}


//3
const leave = (ticketId) => {
    return new Promise((resolve, reject) => {
        connection.beginTransaction(async (err) => {
            try {
                let infoTicket = await getInfoParaking(ticketId)
                const {
                    ticket_id, car_size_id,
                    plate_number,
                    status, car_size,
                    unit_remaining, slot_detail_id
                } = infoTicket

                let paramParkingTransaction = { ticket_id: ticketId, status: statusEnum.complete }
                let updateLeave = await parkingTransactionDB.update(paramParkingTransaction)
                let paramMaster = { unit_remaining: unit_remaining + 1, id: car_size_id }
                let updateMaster = await parkingSlotDB.update(paramMaster)
                const paramSlotDetail = {
                    id: slot_detail_id,
                    status: slotStatus.waiting
                }
                let updateSlotDetail = await parkingSlotDB.updateParkingSlotDetail(paramSlotDetail)
                connection.commit()
                resolve(updateLeave)

            } catch (error) {
                connection.rollback()
                reject(error)
            }
        })
    })
}




//sub
const getInfoParaking = (ticketId) => {
    let sql = "SELECT t.ticket_id , s.id as car_size_id, t.plate_number , t.status , s.car_size "
    sql += " , d.name , s.unit_remaining , t.slot_detail_id "
    sql += " FROM parking_transaction t "
    sql += " JOIN parking_slot s on t.car_size_id = s.id "
    sql += " JOIN parking_slot_detail d ON d.id = t.slot_detail_id "
    sql += " WHERE t.ticket_id = ? "
    return new Promise((resolve, reject) => {
        connection.query(sql, [ticketId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0])
            }
        })
    })
}





const getPark = (param = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await parkingSlotDB.find()
            resolve(data)
        } catch (error) {
            reject(error)
        }

    })
}


// 5
const getPlateNumber = (param) => {
    const { car_size } = param
    return new Promise(async (resolve, reject) => {
        try {
            let findCarSize = await parkingSlotDB.find({ field: "car_size", value: car_size })
            let carSizeId = findCarSize[0].id
            let data = await parkingTransactionDB.find({ field: 'id', value: carSizeId })
            // let result = data.map(element => ({ plate_number: element.plate_number }))
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}


//6
const getAllocatedSlot = (param) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { car_size } = param

            let checked = await parkingSlotDB.isCarSize(car_size)
            if (!checked) {
                return reject("parking not have : " + car_size)
            }

            // let findCarSize = await parkingSlotDB.find({ field: "car_size", value: car_size })
            // let carSizeId = findCarSize[0].id
            let findAllocatedData = await parkingSlotDB.findAllocated(car_size)
            resolve(findAllocatedData)

        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    createParkSlot,//1.1
    deleteParkSlot,//1.2
    insertTranSaction,
    leave,//3
    getPark,//4
    getPlateNumber,//5
    getAllocatedSlot, //6
    getInfoParaking
}
