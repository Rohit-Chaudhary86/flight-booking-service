const{StatusCodes}=require('http-status-codes')

const{Booking}=require('../models')
const CrudRepository = require('./crud-repo')

class BookingRepository extends CrudRepository{
  constructor(){
    super(Booking)
  }
}
module.exports={
    BookingRepository
}