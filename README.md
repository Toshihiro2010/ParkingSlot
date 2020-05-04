# ParkingSlot #

## Create Database ##

1. 
`CREATE DATABASE parking_place`

2. 
`CREATE TABLE parking_slot (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT ,
  car_size varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  unit_max int(11) NOT NULL DEFAULT '0' ,
  unit_remaining int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`

3. 
`CREATE TABLE parking_slot_detail (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT ,
  car_size_id int(11) NOT NULL,
  name varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  status varchar(50) COLLATE utf8_unicode_ci DEFAULT 'waiting'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`

4.
`CREATE TABLE parking_transaction (
  ticket_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  car_size_id int(11) NOT NULL,
  slot_detail_id int(11) NOT NULL,
  plate_number varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  status varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'pending:จอด,complete:ออก'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`


## SET Config for Connect Database ##
open file config.js and Set Data {value}

`
const dbConfig = {
    host: '{hostname}',
    user: '{user}',
    password: '{password}',
    database: '{database}'
}
`

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
|GET|/parking|---|Get all parking|