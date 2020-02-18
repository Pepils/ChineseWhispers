from flask import Flask, request, jsonify, send_from_directory
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin
import os

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"
api = Api(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


class Hello(Resource):
    def get(self):
        return {"message": "Hello, World!"}

# Route
api.add_resource(Hello, '/Hello')

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
