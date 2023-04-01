const mongoose = require('mongoose');
// connect to the database
const connectDB = function(url) {
    return mongoose.connect(url,
        {useNewUrlParser: true,
        useUnifiedTopology: true
      }); // return a promise
}
module.exports = connectDB
