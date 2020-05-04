const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require('./db')
const { status } = require('./dataEnum')


app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.send('<h2>Hello Paking Slot</h2>')
})


app.post('/parking', async (req, res) => {
    let req_json = req.body;
    if (!req_json.plate_number && !req_json.car_size) {
        res.sendStatus(404)
    }
    try {
        let insertObject = await db.insertTranSaction(req_json)
        let parkingInfo = await db.getInfoParaking(insertObject.insertId)
        // console.log("parkingInfo => ", parkingInfo)
        let data = {
            ticket_id: parkingInfo.ticket_id,
            plate_number: parkingInfo.plate_number,
            car_size: parkingInfo.car_size,
            name: parkingInfo.name
        }
        res.json({ data });
    } catch (error) {
        res.status(404).json({ message: error })
    }
})

app.get('/infoTicket/:ticketId', async (req, res) => {
    let ticketId = req.params.ticketId
    try {
        let dataQuery = await db.getInfoParaking(ticketId)
        console.log("dataQuery => ", dataQuery)
        let data = {
            ticketId,
            plate_number: dataQuery.plate_number,
            car_size: dataQuery.car_size,
            name: dataQuery.name
        }
        res.json({ data });
    } catch (error) {
        res.status(404).json({ message: error })
    }
})


app.put('/leavePark/:ticketId', async (req, res) => {
    let ticketId = req.params.ticketId
    try {
        let data = await db.leave(ticketId)
        console.log("data : ", data)
        res.json({ message: "Thank You.!" })
    } catch (error) {
        res.status(404).json({ message: error })
    }
})

app.get('/parking', async (req, res) => {

    try {
        let dataFind = await db.getPark()
        let dataResponse = dataFind.map(element => ({ car_size: element.car_size, unit_remaining: element.unit_remaining }))
        // dataFind.forEach(element => {
        //     let object = {}
        //     object[element.car_size] = element.unit_remaining
        //     dataResponse = { ...dataResponse, ...object }
        // });
        res.json({ data: dataResponse })
    } catch (error) {
        res.status(404).json({ message: error })
    }
})

app.get('/plateNumber/:carSize', async (req, res) => {
    let car_size = req.params.carSize
    try {
        let dataFind = await db.getPlateNumber({ car_size })
        let data = dataFind.map(element => ({ plate_number: element.plate_number }))
        res.json({ data: data })
    } catch (error) {
        res.status(404).json({ message: error })
    }
})

app.get('/allocatedSlot/:carSize', async (req, res) => {
    let car_size = req.params.carSize
    try {
        let dataFind = await db.getAllocatedSlot({ car_size })

        let response = {
            data: dataFind,
            message: dataFind.length == 0 ? car_size + " Not Allocated" : ""
        }
        res.json(response)
    } catch (error) {
        res.status(404).json({ message: error })
    }
})


// app.get('/parking/:carSize', async (req, res) => {
//     let carSize = req.params.carSize
//     try {
//         let data = await db.getPark(carSize)
//         res.send(data)
//     } catch (error) {
//         res.status(404).json({ message: error })
//     }
// })

app.listen(3000, () => {
    console.log('Start server at port 3000.')
})