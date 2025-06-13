const axios=require('axios');
const {StatusCodes}=require('http-status-codes');
const{BookingRepository}=require('../repositories/booking-repo');
const db=require('../models');
const {ServerConfig}=require('../config');
const AppError = require('../utils/errors/app-Error');
const serverConfig = require('../config/server-config');
const{Enums}=require('../utils/common')
const{BOOKED,CANCELLED}=Enums.Booking_STATUS;

const bookingRepository=new BookingRepository();

async function createBooking(data){
    const transaction=await db.sequelize.transaction();
   try {

      const flight=await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`)
        // console.log(flight.data);
        const flightData=flight.data.data;
        if(data.noOfSeats > flightData.totalSeats){
            throw new AppError("Not enought seats avilable ",StatusCodes.BAD_REQUEST);
        }

        totalBillingAmount=data.noOfSeats*flightData.price;
        // console.log(totalBillingAmount);
        const bookingPayload={...data,totalCost:totalBillingAmount};

        const booking=await bookingRepository.create(bookingPayload,transaction);

            await axios.patch(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{
            seats:data.noOfSeats
        });


        await transaction.commit();
        return booking;
   } catch (error) {
        await transaction.rollback();
        throw error;
   }
}

async function makePayment(data){
    const transaction=await db.sequelize.transaction();
   try {
    const bookingDetails=await bookingRepository.get(data.bookingId,transaction);
    if(bookingDetails.status== CANCELLED){
      throw new AppError("The booking has expired ",StatusCodes.BAD_REQUEST);
    }
    console.log(bookingDetails);
    const bookingTime=new Date(bookingDetails.createdAt)
    const currentTime=new Date();
    console.log("⏱ Time difference (ms):", currentTime - bookingTime);
      if(currentTime-bookingTime>600000){
         await bookingRepository.update(data.bookingId,{status:CANCELLED},transaction);
         throw new AppError("The booking has expired ",StatusCodes.BAD_REQUEST);
    }
      
    if(bookingDetails.totalCost!= data.totalCost){
          throw new AppError("Amount of payment dosnt match ",StatusCodes.BAD_REQUEST);
    }
    if(bookingDetails.userId!=data.userId){
         throw new AppError("the user corresponding to the booking dosnt match",StatusCodes.BAD_REQUEST);
    }
    // here assuming that payment is succesfull bcs currently we are not integrationg any payment gateway
    await bookingRepository.update(data.bookingId,{status:BOOKED},transaction);
    await transaction.commit();
   } catch (error) {
     await transaction.rollback()
     throw error;
   }
}

module.exports={
     createBooking,
     makePayment
}