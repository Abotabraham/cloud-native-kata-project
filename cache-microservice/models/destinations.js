const mongoose = require('mongoose');
const flightDetails = mongoose.Schema({
    flag: Number,
    cityFrom: String,
    fromCityIataCode: String,
    flyTo: String,
    flyFrom: String,
    cityTo: String,
    toCityIataCode: String,
    price: String,
    airline: String,
    seats : { type: Number, default: 1 },
    local_departure: String,
    local_arrival: String,
    return : Number,
    booking_link: String,
    targetAmount: Number
})

const flightDetailsModel = mongoose.model("FlightDetail", flightDetails)


module.exports = {
    flightDetailsModel,
}
