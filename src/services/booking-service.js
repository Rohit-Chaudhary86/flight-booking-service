const axios=require('axios');
const {StatusCodes}=require('http-status-codes');
const{BookingRepository}=require('../repositories');
const db=require('../models');
const {ServerConfig}=require('../config');
const appError = require('../utils/errors/app-Error');

async function createBooking(data){
    
    return new Promise((resolve,reject)=>{
      const result=db.sequelize.transaction(async function bookingImpl(t){
        const flight=await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`)
        // console.log(flight.data);
        const flightData=flight.data.data;
        if(data.noOfSeats > flightData.totalSeats){
            reject(new appError("Not enought seats avilable ",StatusCodes.BAD_GATEWAY));
        }
        resolve(true);
      });
   });  
}

module.exports={
     createBooking
}