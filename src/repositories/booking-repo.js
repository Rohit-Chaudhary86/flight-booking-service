const{StatusCodes}=require('http-status-codes')
const {Op}=require('sequelize')
const{Booking}=require('../models')
const CrudRepository = require('./crud-repo')
// const booking = require('../models/booking')
const{Enums}=require('../utils/common')
const{CANCELLED,BOOKED}=Enums.Booking_STATUS;


class BookingRepository extends CrudRepository{
  constructor(){
    super(Booking)
  }
 
  async createBooking(data,transaction){
     const response=booking.create(data,{transaction:transaction})
     return response;
  }

   async get(data,transaction){
            const response=await Booking.findByPk(data,{transaction:transaction});
             if (!response) {
            throw new appError('Not able to find the resource',StatusCodes.NOT_FOUND)
        }
            return response  
    }

     async update(id,data,transaction){  //data is a object
            const response=await Booking.update(data,{
                where:{
                    id:id
                }
            },{transaction:transaction});
            return response;
       
    }

    async cancelOldBookings(timeStamp){
      const response=await Booking.update({status:CANCELLED},{
        where:{
            [Op.and]:[
               {
                createdAt:{
                   [Op.lt]:timeStamp
                }
               },
               {
                status:{
                    [Op.ne]:BOOKED
                }
               },
               {
                status:{
                    [Op.ne]:CANCELLED
                }
               }
            ]
        }
      });
      return response;
    }

}
module.exports={
    BookingRepository
}