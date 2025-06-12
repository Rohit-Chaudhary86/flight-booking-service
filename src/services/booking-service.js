const axios=require('axios');
const {StatusCodes}=require('http-status-codes');
const{BookingRepository}=require('../repositories/booking-repo');
const db=require('../models');
const {ServerConfig}=require('../config');
const AppError = require('../utils/errors/app-Error');
const serverConfig = require('../config/server-config');

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

module.exports={
     createBooking
}
// const axios = require('axios');
// const { StatusCodes } = require('http-status-codes');
// const { BookingRepository, FlightRepository } = require('../repositories');
// const db = require('../models');
// const { ServerConfig } = require('../config');
// const appError = require('../utils/errors/app-Error');

// async function createBooking(data) {
//     const transaction = await db.sequelize.transaction();
    
//     try {
//         // 1. Fetch flight data
//         const response = await axios.get(
//             `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
//         );
//         const flightData = response.data.data;

//         // 2. Validate seat availability
//         if (data.noOfSeats > flightData.totalSeats) {
//             throw new appError(
//                 "Not enough seats available", 
//                 StatusCodes.BAD_REQUEST // Changed from BAD_GATEWAY
//             );
//         }

//         // 3. Create booking
//         const booking = await BookingRepository.create({
//             flightId: data.flightId,
//             noOfSeats: data.noOfSeats,
//             // Add other required fields
//         }, { transaction });

//         // 4. Update available seats
//         await FlightRepository.update({
//             totalSeats: db.sequelize.literal(`totalSeats - ${data.noOfSeats}`)
//         }, {
//             where: { id: data.flightId },
//             transaction
//         });

//         await transaction.commit();
//         return booking;

//     } catch (error) {
//         await transaction.rollback();
        
//         // Handle specific axios errors
//         if (error.response) {
//             if (error.response.status === 404) {
//                 throw new appError('Flight not found', StatusCodes.NOT_FOUND);
//             }
//             throw new appError(
//                 'Flight service error', 
//                 error.response.status || StatusCodes.INTERNAL_SERVER_ERROR
//             );
//         }
        
//         // Re-throw appError instances
//         if (error instanceof appError) {
//             throw error;
//         }
        
//         throw new appError(
//             'Booking failed', 
//             StatusCodes.INTERNAL_SERVER_ERROR
//         );
//     }
// }

// module.exports = {
//     createBooking
// };