# ParkingSlot #
Database : MySql

NodeJS verison : 10.16.0

## Create Database ##

1. 
```js
CREATE DATABASE parking_place
```

2. 
```js
CREATE TABLE parking_slot (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT ,
  car_size varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  unit_max int(11) NOT NULL DEFAULT '0' ,
  unit_remaining int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci
```
3. 
```js
CREATE TABLE parking_slot_detail (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT ,
  car_size_id int(11) NOT NULL,
  name varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  status varchar(50) COLLATE utf8_unicode_ci DEFAULT 'waiting'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci
```
4.
```js
CREATE TABLE parking_transaction (
  ticket_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  car_size_id int(11) NOT NULL,
  slot_detail_id int(11) NOT NULL,
  plate_number varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  status varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'pending:จอด,complete:ออก'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci
```
5.
```js
INSERT INTO parking_slot (car_size) 
VALUES ('small'),('medium'),('large')
```

## SET Config for Connect Database ##
open file config.js and Set Data {value}

```js
const dbConfig = {
    host: '{hostname}',
    user: '{user}',
    password: '{password}',
    database: '{database}'
}
```

## Install dependency ##

`npm install` or `yarn`

## Start project ##

`npm start` or `yarn start`

server start at [http://localhost:3000](http://localhost:3000)

## Start project in development mode ##

`npm run dev` or `yarn dev`
server start at [http://localhost:3000](http://localhost:3000)


## API List ##
|METHOD|URI|Param|DESCRIPTION|
|---|---|---|---|
|GET|/parking||Get Parking Slot Unit|
|GET|/parking/{car_size}|small|Get Parking Slot Unit status by (car_size)|
|POST|/parking|body:{ car_size : "small",name:"s1"}|Create Slot Parking unit pass body |
|DELETE|/parking/{id}|5|Delete Slot Parking by id (5)|
|POST|/enterPark|body: {plate_number :"xxxxx", car_size:"small"}|API Enter Parking pass body |
|PUT|/leavePark/{ticket_id}|1|API Leave Out Parking by ticket_id (1) |
|GET|/plateNumber/{car_size}|small|API get plate number by car_size (small)|
|GET|/allocatedSlot/{car_size}|small|API get Allocated Slot by car_size (small)|
|GET|/infoTicket/{ticket_id}|1|API get information Ticket by ticket_id (2)|

