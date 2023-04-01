
const axios = require("axios");
require("dotenv").config()

const {flightModel,
    flightDetailsModel,
    airlineDetailsModel
  } = require('../models/destinations');
const TEQUILA_END_POINT_LOCATION = "https://api.tequila.kiwi.com/locations/query?"
const TEQUILA_END_POINT_SEARCH = "https://api.tequila.kiwi.com/v2/search?"
const AIRLAB_END_POINT = "https://airlabs.co/api/v9/airlines?"
const AIRLINES_END_POINT = "https://api.skypicker.com/airlines"

const config = {
  headers:{ // set headers for Tequla API requests
    apikey: process.env.TEQUILA_APIKEY
  }
};
// get airline name base on airline code if the airline is not part of IATA
const getAirlines = async function() {
    const airlines = await axios.get(AIRLINES_END_POINT)
    const airlinesData  = airlines.data.forEach(async function(airline) {
        if (airline.type === "airline"){
           const insertAirline = await airlineDetailsModel.create(airline)
        }
    })
}


    // search the cheapest flights and insert the entry into the database
const searchAndCreateFlight = async function (req, res) {
    getAirlines()
     // from city code
     term = "term=" + req.body.from_city;
     fromCityIataCode = await getLoationsIata(term)
    // to city code
     term = "term=" + req.body.to_city;
     toCityIataCode = await getLoationsIata(term)
     //console.log(toCityIataCode);
     const findFlightIfCached = await flightModel.findOne({
       fromCityIataCode:fromCityIataCode, 
       toCityIataCode: toCityIataCode 
     })
    
     const findFlightIfCachedDetailsDB = await flightDetailsModel.findOne({
       fromCityIataCode:fromCityIataCode, 
       toCityIataCode: toCityIataCode 
     })
    var isFound = true
     flightSearchRes = []
     if (!isFlightCached(findFlightIfCached, findFlightIfCachedDetailsDB)){
       flightSearchRes = await searchCheapestFlights(fromCityIataCode, toCityIataCode, req.body.price)
     } else {
        flightSearchRes = findFlightIfCachedDetailsDB
        isFound = false
     }
  
     flightData = {}

     flightInputs = {}
     if (flightSearchRes.length > 0 && isFound) {
        // extract flight details if a cheapes flight was found 
       var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',hour:'numeric', minute: 'numeric'};
       lowestPrice = flightSearchRes[0].price
       flyFrom = flightSearchRes[0].flyFrom
       flyTo = flightSearchRes[0].flyTo
       cityFrom = flightSearchRes[0].cityFrom
       cityTo = flightSearchRes[0].cityTo
       availability = flightSearchRes[0].availability.seats
       if (availability === null){
        availability = 1
       }
       local_departure = flightSearchRes[0].local_departure

       local_departure = new Date(Date.parse(local_departure)).toLocaleString("en-US", options)
       local_arrival = flightSearchRes[0].local_arrival
       local_arrival = new Date(Date.parse(local_arrival)).toLocaleString("en-US",options)
       localairlineCode = flightSearchRes[0].airlines
       isReturn = flightSearchRes[0].route[0].return
       booking_link = flightSearchRes[0].deep_link
       airlineCode = flightSearchRes[0].airlines
  
        // airlab query
       let airlineName = await getAirlineName(airlineCode)
       if (airlineName) {
        airlineName = airlineName.name
       }else {
         const airlineNameFromAirlineData = await airlineDetailsModel.find({id:airlineCode[0]});
         airlineName = airlineNameFromAirlineData[0].name;
       }
       // data from flight seach API 
       flightData = {
        flag: 1,
         cityFrom: cityFrom,
         fromCityIataCode: fromCityIataCode,
         flyFrom: flyFrom,
         flyTo: flyTo,
         cityTo: cityTo,
         toCityIataCode: toCityIataCode,
         price: lowestPrice,
         targetAmount:req.body.price,
         airline: airlineName,
         seats : availability,
         local_departure: local_departure,
         local_arrival: local_arrival,
         return : isReturn,
         booking_link: booking_link
         
       }
       flightSearchRes = flightData
      // inputs from the user
       const flightInputs = {
         fromCity: req.body.from_city,
         fromCityIataCode: fromCityIataCode,
         toCity: req.body.to_city,
         toCityIataCode: toCityIataCode, 
         price: lowestPrice,
       }
      try {
        const p1 = await flightModel.create(flightInputs) // insert user details into flightDB
        const p2 = await flightDetailsModel.create(flightData) // insert Flight Search details(data from API)
      } catch (error) {
        return res.json({error: error.message})
      }
      
 
     } 

   if (flightSearchRes.length < 1) {
     return  res.json({
          flag: 0,
          success: "False", 
          msg: `No Flights Found`,
          fromCity: req.body.from_city,
          toCity: req.body.to_city
     });
   }else {
      return res.json(flightSearchRes)
  } 
    
}

 // check if if the current seach exists in the datebase. Return true if it exists otherwise false
const isFlightCached = function(findFlightIfCachedDetailsDB, findFlightIfCached){
    if (findFlightIfCached == null && findFlightIfCachedDetailsDB == null){
      return false
    }
    return true
  }

  // finds City IATA code from Tequila API
  const getLoationsIata = async function (term){
    //from city location search query for iata
  flightLocationQuery =  TEQUILA_END_POINT_LOCATION + term + "&location_types=city";
  const flightLocationRes = await axios.get(flightLocationQuery, config);
  const cityIataCode = flightLocationRes.data.locations[0].code
  return cityIataCode
}

// find the cheapest flight six months from the following day
const searchCheapestFlights = async function(fromCityIataCode, toCityIataCode, price) {
    // for date 6 monthns start from next date 
    const timeElapsed = Date.now() + 86400000; // 24hrs in milliseconds

    const dateInMills = new Date(timeElapsed)
    // from date start from next date
    let dateFrom = new Date(dateInMills.setMonth(dateInMills.getMonth() + 1))
    dateFrom = `${dateFrom.getDate()}/${dateFrom.getMonth()}/${dateFrom.getFullYear()}`

    // to date start 6 month month from next date
    let dateTo = new Date(dateInMills.setMonth(dateInMills.getMonth() + 6))
    dateTo = `${dateTo.getDate()}/${dateTo.getMonth()}/${dateTo.getFullYear()}`

    flightSearchQuery = TEQUILA_END_POINT_SEARCH + "fly_from=" + fromCityIataCode + "&fly_to=" + toCityIataCode + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&price_to="+ price + "&curr=USD&max_stopovers=3"
    const flightSearchRes = await axios.get(flightSearchQuery, config);
    return flightSearchRes.data.data;
  }


  const getAirlineName = async function(airlineCode){
    const airlabQuery = AIRLAB_END_POINT + "api_key=" + process.env.LABAIR_APIKEY + "&iata_code=" + airlineCode
    const airlabResponse = await axios.get(airlabQuery)
    return airlabResponse.data.response[0]
}

module.exports = {
    searchAndCreateFlight,
}
