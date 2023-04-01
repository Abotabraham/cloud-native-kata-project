const {
    flightDetailsModel,
  
  } = require('../models/destinations');
const getFlights = async function(req, res) {
    try {
        const flights = await flightDetailsModel.find({});
        if (flights.length > 0) {
            return res.status(200).json(flights);
        } else {
           return res.status(404).json({}); //No fligts in the DB
        }
    } catch (error) {
        return res.json({error: error.message})
    }
    } 


module.exports = {
    getFlights
}