import os
from flask import Flask, render_template, request
import requests

FLIGHTS_ENDPOINT = os.environ.get('VIEW_FLIGHTS_URL')
app = Flask(__name__)

@app.route("/flights", methods=["GET"])
def getFlight():
    searchedFlights = requests.get(FLIGHTS_ENDPOINT).json()
    return render_template("recent.html", flight_data=searchedFlights)

if __name__ == '__main__':
    app.run(debug=True, port=8080, host='0.0.0.0')