import os
from flask import Flask, request, jsonify, send_from_directory
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin
from models import Record, RecordSchema, Entry, EntrySchema
from run import app,db,ma,migrate

api = Api(app)
cors = CORS(app, resources={r"/*": {"origins": "*", "expose_headers": "X-Total-Count"}})

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
        res = jsonify(record_schema.dump(record))
        return res 

    def put(self, record_id):
        json_data = request.get_json(force=True)
        if not json_data:
               return {'message': 'No input data provided'}, 400
        print(json_data)
        try:
            data = record_schema.load(json_data)
        except ma.exceptions.ValidationError:
            return errors, 422
        record = Record.query.filter_by(id=record_id).first()
        if not record:
            return {'message': 'Record does not exist'}, 400
        record.filepath = data['filepath']
        record.lang = data['lang']
        record.langfam = data['langfam']
        record.added = data['added']
        record.pending = data['pending']
        db.session.commit()
        res = jsonify(record_schema.dump(record))
        return res 
        # return { "status": 'success', 'data': res }, 204

    def delete(self, record_id):
        # json_data = request.get_json(force=True)
        # if not json_data:
               # return {'message': 'No input data provided'}, 400
        # Validate and deserialize input
        # data, errors = record_schema.load(json_data)
        # if errors:
            # return errors, 422
        record = Record.query.filter_by(id=record_id).delete()
        db.session.commit()
        res = jsonify(record_schema.dump(record))
        return res 
        # return { "status": 'success', 'data': res }, 204

class RecordResource(Resource):
    def get(self):
        records = Record.query.all()
        res = jsonify(records_schema.dump(records))
        res.headers["X-Total-Count"] = len(records)
        return res

    def post(self):
        print(request.form)
        print(request.files)
        json_data = request.form.to_dict()
        print(json_data)
        if not json_data:
            return {'message': 'No input data provided'}, 400
        file = request.files['file']
        if not file:
            return {'message': 'No input file provided'}, 400
        filename = json_data['filename']
        file.save(os.path.join(os.getcwd(),"static",filename+".webm"))
        # data, errors = record_schema.load(json_data)
        # if errors:
            # return errors, 422
        record = Record(filepath=os.path.join(os.getcwd(),"static",filename+".webm"),
                lang=json_data['lang'], 
                langfam=json_data['langfam'],
                added=False,
                pending=True
                )
        db.session.add(record)
        db.session.commit()
        res = jsonify(record_schema.dump(record))
        return res 
        # return { 'status':'success', 'data': res }, 201

class GetEntryResource(Resource):
    def get(self, entry_id):
        entry = Entry.query.filter_by(id=entry_id).first()
        if not entry:
            return {'message': 'Entry does not exist'}, 400
        res = jsonify(entry_schema.dump(entry))
        return res 
        # return { 'status':'success', 'data': res }, 200

    def put(self, entry_id):
        json_data = request.get_json(force=True)
        if not json_data:
               return {'message': 'No input data provided'}, 400
        print(json_data)
        try:
            data = entry_schema.load(json_data)
        except ma.exceptions.ValidationError:
            return errors, 422
        entry = Entry.query.filter_by(id=entry_id).first()
        if not entry:
            return {'message': 'Entry does not exist'}, 400
        entry.text = data['text']
        entry.record_id = data['record_id']
        db.session.commit()
        res = jsonify(entry_schema.dump(entry))
        return res 
        # return { "status": 'success', 'data': res }, 204

    def delete(self, entry_id):
        # json_data = request.get_json(force=True)
        # if not json_data:
        #        return {'message': 'No input data provided'}, 400
        # # Validate and deserialize input
        # data, errors = entry_schema.load(json_data)
        # if errors:
        #     return errors, 422
        entry = Entry.query.filter_by(id=entry_id).delete()
        db.session.commit()
        res = jsonify(entry_schema.dump(entry))
        return res 
        # return { "status": 'success', 'data': res }, 204

class EntryResource(Resource):
    def get(self):
        entries = Entry.query.all()
        res = jsonify(entries_schema.dump(entries))
        res.headers["X-Total-Count"] = len(entries)
        return res
        # return { 'status':'success', 'data': entries }, 200 

    def post(self):
        json_data = request.get_json(force=True)
        if not json_data:
            return {'message': 'No input data provided'}, 400
        try:
            data = entry_schema.load(json_data)
        except ma.exceptions.ValidationError:
            return errors, 422
        entry = Entry(text=json_data['text'], 
                record_id=json_data['record_id']    
                )
        db.session.add(entry)
        db.session.commit()
        res = jsonify(entry_schema.dump(entry))
        return res 
        # return { 'status':'success', 'data': res }, 201




# Route
api.add_resource(Hello, '/Hello')
api.add_resource(RecordResource, '/records')
api.add_resource(GetRecordResource, '/records/<record_id>')
api.add_resource(EntryResource, '/entries')
api.add_resource(GetEntryResource, '/entries/<entry_id>')

# @app.route('/postfile', methods=['GET','POST'])
# @cross_origin()
# def upload_file():
#     if request.method == 'POST':
#         print(request.files)
#         print(request.form)
#         file = request.files['file']
#         if file:
#             filename = request.form['filename']
#             file.save(os.path.join(os.getcwd(), "static", filename+".webm"))
#         return "Hello"
@app.route('/files/<path:filename>')
def download_file(filename):
    print(filename)
    return send_from_directory(os.getcwd()+"/static/", filename, as_attachment=True)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
