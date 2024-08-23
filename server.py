from flask import Flask, Response, render_template, request
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

def write_app_data(data):
    """
    Overwrites data from app into data file. Data file path set in env file.
    @params data: JSON formatted data to written into file
    @returns None
    """
    print("Overwriting data from: " + data_file)
    print("Data to write: ")
    print(data)
    f = open(data_file, "w")
    f.write(json.dumps(data))
    f.close()

@app.route("/data", methods=["GET"])
def get_data():
    try:
        return Response(read_app_data(), mimetype='application/json', status=200)
    except:
        return Response(json.dumps({"Message": "Error retrieving data."}), mimetype='application/json', status=500)
    

@app.route("/data", methods=["POST"])
def update_data():
    try:
        write_app_data(request.json)
        return Response(json.dumps({"Database updated?" : True}), mimetype='application/json', status=200)
    except Exception as e:
        print(e)
        return Response(json.dumps({"Database updated?": False, "Message" : "Error Updating Database."}), mimetype='application/json', status=500)

@app.route("/app")
def render_index():
    return render_template("index.html")

@app.route("/app/routine/<routine_id>")
def render_routine(routine_id):
    return render_template("routine.html")

if __name__ == "__main__":
    app.run(debug=True, port=port)
    # When no port is specified, starts at default port 5000