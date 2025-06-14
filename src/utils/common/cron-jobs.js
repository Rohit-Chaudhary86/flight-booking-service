const cron = require('node-cron');
const {BookingService} =require('../../services/index')

function scheduleCrons() {
  cron.schedule('*/30 * * * * ', async () => {
    console.log("starting cron again",BookingService);
    const bookingService = require('../../services/booking-service'); // lazy require
    try {
      const response = await BookingService.cancelOldBookings();
      console.log(response);
    } catch (error) {
      console.error('[NODE-CRON] [ERROR]', error);
    }
  });
}

module.exports = scheduleCrons;
