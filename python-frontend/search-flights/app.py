import os
from flask import Flask, render_template, request
import requests

CREATE_FLIGHT = os.environ.get('SEARCH_FLIGHT_URL')
app = Flask(__name__)
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/flight', methods=['POST'])
def searchFlights():
    from_city = request.form["from_city"]
    to_city = request.form["to_city"]
    price = request.form["price"]
    response = requests.post(CREATE_FLIGHT,data={"from_city": from_city, "to_city": to_city, "price":price})
    flight_data = response.json()
    return render_template("details.html",flight_data=flight_data)


if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')