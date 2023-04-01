const mongoose = require('mongoose');
const flightSchema = mongoose.Schema({
    fromCity: String,
    fromCityIataCode: String,
    toCity: String,
    toCityIataCode: String,
    price: String,
})

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

const airlineDetails = mongoose.Schema({
    id: String,
    lcc: Number,
    name: String,
    type: String
})

const flightModel = mongoose.model("Destination", flightSchema)
const flightDetailsModel = mongoose.model("FlightDetail", flightDetails)
const airlineDetailsModel = mongoose.model("AirlineDetails", airlineDetails)

module.exports = {
    flightModel,
    flightDetailsModel,
    airlineDetailsModel,
}
