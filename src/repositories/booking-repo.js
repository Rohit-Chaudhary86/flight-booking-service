const{StatusCodes}=require('http-status-codes')

const{Booking}=require('../models')
const CrudRepository = require('./crud-repo')
const booking = require('../models/booking')

class BookingRepository extends CrudRepository{
  constructor(){
    super(Booking)
  }
 
  async createBooking(data,transaction){
     const response=booking.create(data,{transaction:transaction})
     return response;
  }

}
module.exports={
    BookingRepository
}