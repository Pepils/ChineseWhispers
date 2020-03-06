import os
from flask import Flask, request, jsonify, send_from_directory
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin
from models import Recording, RecordingSchema 
from run import app,db,ma,migrate

api = Api(app)
cors = CORS(app, resources={r"/*": {"origins": "*", "expose_headers": "X-Total-Count"}})

recordings_schema = RecordingSchema(many=True)
recording_schema = RecordingSchema()

# entries_schema = EntrySchema(many=True)
# entry_schema = EntrySchema()

class Hello(Resource):
    def get(self):
        return {"message": "Hello, World!"}

class GetRecordingResource(Resource):
    def get(self, recording_id):
        recording = Recording.query.filter_by(id=recording_id).first()
        if not recording:
            return {'message': 'Recording does not exist'}, 400
        res = jsonify(recording_schema.dump(recording))
        return res 

    def put(self, recording_id):
        json_data = request.get_json(force=True)
        if not json_data:
               return {'message': 'No input data provided'}, 400
        print(json_data)
        try:
            data = recording_schema.load(json_data)
        except ma.exceptions.ValidationError:
            return errors, 422
        recording = Recording.query.filter_by(id=recording_id).first()
        if not recording:
            return {'message': 'Recording does not exist'}, 400
        recording.filepath = data['filepath']
        recording.lang = data['lang']
        recording.langfam = data['langfam']
        recording.added = data['added']
        recording.pending = data['pending']
        recording.name = data['name']
        recording.transcript = data['transcript']
        db.session.commit()
        res = jsonify(recording_schema.dump(recording))
        return res 
        # return { "status": 'success', 'data': res }, 204

    def delete(self, recording_id):
        # json_data = request.get_json(force=True)
        # if not json_data:
               # return {'message': 'No input data provided'}, 400
        # Validate and deserialize input
        # data, errors = record_schema.load(json_data)
        # if errors:
            # return errors, 422
        recording = Recording.query.filter_by(id=recording_id).delete()
        db.session.commit()
        res = jsonify(recording_schema.dump(recording))
        return res 
        # return { "status": 'success', 'data': res }, 204

class RecordingResource(Resource):
    def get(self):
        recordings = Recording.query.all()
        res = jsonify(recordings_schema.dump(recordings))
        res.headers["X-Total-Count"] = len(recordings)
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
        recording = Recording(filepath=os.path.join(os.getcwd(),"static",filename+".webm"),
                lang=json_data['lang'], 
                langfam=json_data['langfam'],
                added=False,
                pending=True,
                transcript=json_data['transcript'],
                name=json_data['name']
                )
        db.session.add(recording)
        db.session.commit()
        res = jsonify(recording_schema.dump(recording))
        return res 
        # return { 'status':'success', 'data': res }, 201

# class GetEntryResource(Resource):
#     def get(self, entry_id):
#         entry = Entry.query.filter_by(id=entry_id).first()
#         if not entry:
#             return {'message': 'Entry does not exist'}, 400
#         res = jsonify(entry_schema.dump(entry))
#         return res 
#         # return { 'status':'success', 'data': res }, 200

#     def put(self, entry_id):
#         json_data = request.get_json(force=True)
#         if not json_data:
#                return {'message': 'No input data provided'}, 400
#         print(json_data)
#         try:
#             data = entry_schema.load(json_data)
#         except ma.exceptions.ValidationError:
#             return errors, 422
#         entry = Entry.query.filter_by(id=entry_id).first()
#         if not entry:
#             return {'message': 'Entry does not exist'}, 400
#         entry.text = data['text']
#         entry.recording_id = data['record_id']
#         db.session.commit()
#         res = jsonify(entry_schema.dump(entry))
#         return res 
#         # return { "status": 'success', 'data': res }, 204

    # def delete(self, entry_id):
    #     # json_data = request.get_json(force=True)
    #     # if not json_data:
    #     #        return {'message': 'No input data provided'}, 400
    #     # # Validate and deserialize input
    #     # data, errors = entry_schema.load(json_data)
    #     # if errors:
    #     #     return errors, 422
    #     entry = Entry.query.filter_by(id=entry_id).delete()
    #     db.session.commit()
    #     res = jsonify(entry_schema.dump(entry))
    #     return res 
    #     # return { "status": 'success', 'data': res }, 204

# class EntryResource(Resource):
    # def get(self):
    #     entries = Entry.query.all()
    #     res = jsonify(entries_schema.dump(entries))
    #     res.headers["X-Total-Count"] = len(entries)
    #     return res
    #     # return { 'status':'success', 'data': entries }, 200 

    # def post(self):
    #     json_data = request.get_json(force=True)
    #     if not json_data:
    #         return {'message': 'No input data provided'}, 400
    #     try:
    #         data = entry_schema.load(json_data)
    #     except ma.exceptions.ValidationError:
    #         return errors, 422
    #     entry = Entry(text=json_data['text'], 
    #             record_id=json_data['record_id']    
    #             )
    #     db.session.add(entry)
    #     db.session.commit()
    #     res = jsonify(entry_schema.dump(entry))
    #     return res 
    #     # return { 'status':'success', 'data': res }, 201




# Route
api.add_resource(Hello, '/Hello')
api.add_resource(RecordingResource, '/recordings')
api.add_resource(GetRecordingResource, '/recordings/<recording_id>')
# api.add_resource(EntryResource, '/entries')
# api.add_resource(GetEntryResource, '/entries/<entry_id>')

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
