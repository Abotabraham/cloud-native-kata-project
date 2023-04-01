const express = require('express');
const connectDB = require('./db/connection');
const {searchAndCreateFlight} = require('./controllers/flights');
const app = express();

// middleware
app.use(express.urlencoded({ extended: true}))
app.use(express.json());

// create and save flight data to DB
app.post('/api/v1/flight', searchAndCreateFlight);

const start = async () =>  {
    try {     
      const db = await connectDB(process.env.MONGODB_CONNECTION_STRING) //offloading, wait for connection before starting the server
      app.listen(3000, function () {
      console.log(`Server is listening on 3000...`);
      })
    } catch (error) {
      console.log(error);;
    }
  }
  start()




