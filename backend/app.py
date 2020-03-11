import os
from flask import Flask, request, jsonify, send_from_directory
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin
from webargs.flaskparser import parser, use_args, use_kwargs
from webargs import fields, validate
from models import Recording, RecordingSchema, Lang, LangSchema 
from run import app,db,ma,migrate

api = Api(app)
cors = CORS(app, resources={r"/*": {"origins": "*", "expose_headers": "X-Total-Count"}})

recordings_schema = RecordingSchema(many=True)
recording_schema = RecordingSchema()

# entries_schema = EntrySchema(many=True)
# entry_schema = EntrySchema()

getlistargs = {
    "_sort": fields.String(),
    "_order": fields.String(),
    "_start": fields.Int(),
    "_end": fields.Int()
}

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
    @use_args(getlistargs, location="query")
    def get(self, args):
        recordings = Recording.query.all()
        if args.get('_order') and args.get('_sort'):
            if args['_order'] == 'ASC':
                recordings.sort(key=lambda x:getattr(x,args['_sort']))
            else:
                recordings.sort(key=lambda x:getattr(x,args['_sort']), reverse=True)
        if not args.get('_start') is None and not args.get('_end') is None:
            print('rm')
            recordings = recordings[args['_start']:args['_end']]

        res = jsonify(recordings_schema.dump(recordings))
        res.headers["X-Total-Count"] = len(recordings)
        return res

    def post(self):
        print("dat:",request.data)
        print("form:",request.form)
        print("files:",request.files)
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

langs_schema = LangSchema(many=True)
class LangagesResource(Resource):
    @use_args(getlistargs, location="query")
    def get(self, args):
        lang = Lang.query.all()
        if args.get('_order') and args.get('_sort'):
            if args['_order'] == 'ASC':
                lang.sort(key=lambda x:getattr(x,args['_sort']))
            else:
                lang.sort(key=lambda x:getattr(x,args['_sort']), reverse=True)
        if not args.get('_start') is None and not args.get('_end') is None:
            print('rm')
            lang = lang[args['_start']:args['_end']]

        res = jsonify(langs_schema.dump(lang))
        res.headers["X-Total-Count"] = len(lang)
        return res


# Route
api.add_resource(Hello, '/Hello')
api.add_resource(RecordingResource, '/recordings')
api.add_resource(GetRecordingResource, '/recordings/<recording_id>')
api.add_resource(LangagesResource, '/langages')
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
