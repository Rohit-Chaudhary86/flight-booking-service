const{StatusCodes}=require('http-status-codes')
const{BookingService}=require('../services')
const {SuccessResponse,ErrorResponse}=require('../utils/common')
const inMemDb={};

async function createBooking(req,res){
 try { 
    const response=await BookingService.createBooking({
      flightId:req.body.flightId,
      userId:req.body.userId,
      noOfSeats:req.body.noOfSeats 
    });
    SuccessResponse.data=response;
    return res
             .status(StatusCodes.CREATED)
             .json(SuccessResponse);
  } catch (error) {
    console.log(error);
     ErrorResponse.error=error;
    return res
             .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
             .json(ErrorResponse);
  }
}

async function makePayment(req,res){
 try { 
    const idempodencyKey=req.headers['x-idempotency-key']
    if(!idempodencyKey){
        return res
             .status(StatusCodes.BAD_REQUEST)
             .json({message:"idempotency key missing"});
    }
    if(inMemDb[idempodencyKey]){
          return res
             .status(StatusCodes.BAD_REQUEST)
             .json({message:"cant retry on a succesfull payment"});
    }
    const response=await BookingService.makePayment({
      totalCost:req.body.totalCost,
      userId:req.body.userId,
      bookingId:req.body.bookingId 
    });
    inMemDb[idempodencyKey]=idempodencyKey
    SuccessResponse.data=response;
    return res
             .status(StatusCodes.CREATED)
             .json(SuccessResponse);
  } catch (error) {
    console.log(error);
     ErrorResponse.error=error;
    return res
             .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
             .json(ErrorResponse);
  }
}


module.exports={
     createBooking,
     makePayment
}