const express = require('express');
const connectDB = require('./db/connection');
const {getFlights} = require('./controllers/flights');
const app = express();

// middleware
app.use(express.urlencoded({ extended: true}))
app.use(express.json());

// get all flights from the database
app.get("/api/v1/flights", getFlights)

// get all flights details from the database

    const start = async () =>  {
        try {
          const db = await connectDB(process.env.MONGODB_CONNECTION_STRING) //offloading, wait for connection before starting the server
          app.listen(4040, function () {
          console.log(`Server is listening on 4040...`);
          })
        } catch (error) {
          console.log(error);;
        }
      }
      start()