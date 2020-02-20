import os
from flask import Flask, request, jsonify, send_from_directory
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin
from models import Record, RecordSchema, Entry, EntrySchema
from run import app,db,ma,migrate

api = Api(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

records_schema = RecordSchema(many=True)
record_schema = RecordSchema()

entries_schema = EntrySchema(many=True)
entry_schema = EntrySchema()

class Hello(Resource):
    def get(self):
        return {"message": "Hello, World!"}


class GetRecordResource(Resource):
    def get(self, record_id):
        record = Record.query.filter_by(id=record_id).first()
        if not record:
            return {'message': 'Record does not exist'}, 400
        res = jsonify(record_schema.dump(entry))
        return { 'status':'success', 'data': res }, 200

class RecordResource(Resource):
    def get(self):
        records = Record.query.all()
        records = jsonify(records_schema.dump(records))
        return { 'status':'success', 'data': records }, 200
    
    def delete(self):
        json_data = request.get_json(force=True)
        if not json_data:
               return {'message': 'No input data provided'}, 400
        # Validate and deserialize input
        data, errors = record_schema.load(json_data)
        if errors:
            return errors, 422
        record = Record.query.filter_by(id=data['id']).delete()
        db.session.commit()
        res = jsonify(record_schema.dump(record))
        return { "status": 'success', 'data': res }, 204


class GetEntryResource(Resource):
    def get(self, entry_id):
        entry = Entry.query.filter_by(id=entry_id).first()
        if not entry:
            return {'message': 'Entry does not exist'}, 400
        res = jsonify(entry_schema.dump(entry))
        return { 'status':'success', 'data': res }, 200

class EntryResource(Resource):
    def get(self):
        entries = Entry.query.all()
        entries = jsonify(entries_schema.dump(entries))
        return { 'status':'success', 'data': entries }, 200

    def post(self):
        json_data = request.get_json(force=True)
        if not json_data:
            return {'message': 'No input data provided'}, 400
        data, errors = entry_schema.load(json_data)
        if errors:
            return errors, 422
        entry = Entry(text=json_data['text'], 
                record_id=json_data['record_id']    
                )
        db.session.add(entry)
        db.session.commit()
        res = jsonify(entry_schema.dump(entry))
        return { 'status':'success', 'data': res }, 201

    def put(self):
        json_data = request.get_json(force=True)
        if not json_data:
               return {'message': 'No input data provided'}, 400
        data, errors = entry_schema.load(json_data)
        if errors:
            return errors, 422
        entry = Entry.query.filter_by(id=data['id']).first()
        if not entry:
            return {'message': 'Entry does not exist'}, 400
        entry.text = data['text']
        entry.record_id = data['record_id']
        db.session.commit()
        res = jsonify(entry_schema.dump(entry))
        return { "status": 'success', 'data': res }, 204

    def delete(self):
        json_data = request.get_json(force=True)
        if not json_data:
               return {'message': 'No input data provided'}, 400
        # Validate and deserialize input
        data, errors = entry_schema.load(json_data)
        if errors:
            return errors, 422
        entry = Entry.query.filter_by(id=data['id']).delete()
        db.session.commit()
        res = jsonify(entry_schema.dump(entry))
        return { "status": 'success', 'data': res }, 204


# Route
api.add_resource(Hello, '/Hello')
api.add_resource(RecordResource, '/records')
api.add_resource(GetRecordResource, '/records/<record_id>')
api.add_resource(EntryResource, '/entries')
api.add_resource(GetEntryResource, '/entries/<entry_id>')

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
