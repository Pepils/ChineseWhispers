from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin
import os

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/postfile', methods=['GET','POST'])
@cross_origin()
def upload_file():
    if request.method == 'POST':
        print(request.files)
        print(request.form)
        file = request.files['file']
        if file:
            filename = request.form['filename']
            file.save(os.path.join(os.getcwd(), "static", filename+".webm"))
        return "Hello"

@app.route('/files/<path:filename>')
def download_file(filename):
    print(filename)
    return send_from_directory(os.getcwd()+"/static/", filename, as_attachment=True)


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
