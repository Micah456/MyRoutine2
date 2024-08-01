from flask import Flask, Response, render_template
import json, os
from dotenv import load_dotenv

load_dotenv()

port = 5016
app = Flask("MyRoutine2")
data_file = os.getenv("data_file")

def read_app_data():
    """
    Reads data from app data file. Data file path set in env file.
    Data must be in json format
    @returns data in json format
    """
    print("Reading data from: " + data_file)
    f = open(data_file)
    return f.readline()

@app.route("/data")
def get_data():
    try:
        return Response(read_app_data(), mimetype='application/json', status=200)
    except:
        return Response(json.dumps({"Message": "Error retrieving data."}), mimetype='application/json', status=500)

@app.route("/app")
def render_index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True, port=port)
    # When no port is specified, starts at default port 5000