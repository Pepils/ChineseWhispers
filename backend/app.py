import os
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin
from webargs.flaskparser import parser, use_args, use_kwargs
from webargs import fields, validate
from marshmallow import exceptions
from models import Recording, RecordingSchema, Lang, LangSchema, Poem, PoemSchema 
from run import app,db,ma,migrate

api = Api(app)
cors = CORS(app, resources={r"/*": {"origins": "*", "expose_headers": "X-Total-Count"}})

recordings_schema = RecordingSchema(many=True)
recording_schema = RecordingSchema()

lang_schema = LangSchema()
langs_schema = LangSchema(many=True)

poem_schema = PoemSchema()
poems_schema = PoemSchema(many=True)
# entries_schema = EntrySchema(many=True)
# entry_schema = EntrySchema()

getlistargs = {
    "_sort": fields.String(),
    "_order": fields.String(),
    "_start": fields.Int(),
    "_end": fields.Int(),
    "id": fields.Int(),
    "name": fields.String(),
    "lang_id": fields.String(),
    "langfam": fields.String(),
    "poem_id": fields.String(),
    "added": fields.Bool(),
    "pending": fields.Bool()
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
        json_data = request.get_json()
        if not json_data:
               return {'message': 'No input data provided'}, 400
        print("jsondata:", json_data)
        try:
            data = recording_schema.load(json_data)
        except exceptions.ValidationError:
            return {'error'}, 422
        print("data:",data)
        recording = Recording.query.filter_by(id=recording_id).first()
        if not recording:
            return {'message': 'Recording does not exist'}, 400
        recording.filepath = data['filepath']
        recording.lang_id = data['lang_id']
        recording.poem_id = data['poem_id']
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
        # res = jsonify(recording_schema.dump(recording))
        # return res 
        return { 'id': recording }, 200


class RecordingResource(Resource):
    @use_args(getlistargs, location="query")
    def get(self, args):
        recordings = Recording.query
        if args.get('id') is not None:
            recordings = recordings.filter_by(id=args['id'])
        if args.get('name') is not None:
            recordings = recordings.filter_by(name=args['name'])
        if args.get('lang_id') is not None:
            recordings = recordings.filter_by(lang=args['lang_id'])
        if args.get('poem_id') is not None:
            recordings = recordings.filter_by(poem_id=args['poem_id'])
        if args.get('added') is not None:
            recordings = recordings.filter_by(added=args['added'])
        if args.get('pending') is not None:
            recordings = recordings.filter_by(pending=args['pending'])
        recordings = recordings.all()

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
        # print("dat:",request.data)
        # print("form:",request.form)
        # print("files:",request.files)
        if request.data != b'':
            json_file = json.loads(request.data).get('filepath')
            recording = Recording.query.filter_by(filepath=json_file.get('title')).first()
            res = jsonify(recording_schema.dump(recording))
            return res
        json_data = request.form.to_dict()
        # print(json_data)
        if not json_data:
            return {'message': 'no input data provided'}, 400
        file = request.files['file']
        if not file:
            return {'message': 'no input file provided'}, 400
        filename = json_data['filename']
        file.save(os.path.join(os.getcwd(),"static",filename))
        # data, errors = record_schema.load(json_data)
        # if errors:
            # return errors, 422
        recording = Recording(#filepath=os.path.join(os.getcwd(),"static",filename+".webm"),
                filepath=filename,
                lang_id=json_data['lang_id'], 
                poem_id=json_data['poem_id'], 
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


class LangagesResource(Resource):
    @use_args(getlistargs, location="query")
    def get(self, args):
        lang = Lang.query
        if args.get('id') is not None:
            lang = lang.filter_by(id=args['id'])
        if args.get('name') is not None:
            lang = lang.filter_by(name=args['name'])
        lang = lang.all()

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

    def post(self):
        # print("dat:",request.data)
        json_data = json.loads(request.data)
            # recording = recording.query.filter_by(filepath=json_file.get('title')).first()
            # res = jsonify(recording_schema.dump(recording))
            # return res
        # json_data = request.form.to_dict()
        # print(json_data)
        if not json_data:
            return {'message': 'no input data provided'}, 400
        name = json_data['name']
        # data, errors = record_schema.load(json_data)
        # if errors:
            # return errors, 422
        lang = Lang(#filepath=os.path.join(os.getcwd(),"static",filename+".webm"),
                name=json_data['name']
                )
        db.session.add(lang)
        db.session.commit()
        res = jsonify(lang_schema.dump(lang))
        return res 


class GetLangResource(Resource):
    def get(self, lang_id):
        lang = Lang.query.filter_by(id=lang_id).first()
        if not lang:
            return {'message': 'Lang does not exist'}, 400
        res = jsonify(lang_schema.dump(lang))
        return res 

    def put(self, lang_id):
        json_data = request.get_json(force=True)
        if not json_data:
               return {'message': 'No input data provided'}, 400
        print(json_data)
        try:
            data = lang_schema.load(json_data)
        except exceptions.ValidationError:
            return {'error'}, 422
        lang = Lang.query.filter_by(id=lang_id).first()
        if not lang:
            return {'message': 'Lang does not exist'}, 400
        lang.name = data['name']
        db.session.commit()
        res = jsonify(lang_schema.dump(lang))
        return res 
        # return { "status": 'success', 'data': res }, 204
    
    def delete(self, lang_id):
        lang = Lang.query.filter_by(id=lang_id).delete()
        db.session.commit()
        # res = jsonify(lang_schema.dump(lang))
        # return res 
        return { 'id': lang }, 200


class GetPoemResource(Resource):
    def get(self, poem_id):
        poem = Poem.query.filter_by(id=poem_id).first()
        if not poem:
            return {'message': 'Poem does not exist'}, 400
        res = jsonify(poem_schema.dump(poem))
        return res 

    def put(self, poem_id):
        json_data = request.get_json(force=True)
        if not json_data:
               return {'message': 'No input data provided'}, 400
        print(json_data)
        try:
            data = poem_schema.load(json_data)
        except exceptions.ValidationError:
            return errors, 422
        poem = Poem.query.filter_by(id=poem_id).first()
        if not poem:
            return {'message': 'Poem does not exist'}, 400
        poem.name = data['name']
        db.session.commit()
        res = jsonify(poem_schema.dump(poem))
        return res 
        # return { "status": 'success', 'data': res }, 204
    
    def delete(self, poem_id):
        poem = Poem.query.filter_by(id=poem_id).delete()
        db.session.commit()
        # res = jsonify(poem_schema.dump(poem))
        # return res 
        return { 'id': poem }, 200


class PoemsResource(Resource):
    @use_args(getlistargs, location="query")
    def get(self, args):
        poem = Poem.query
        if args.get('id') is not None:
            poem = poem.filter_by(id=args['id'])
        poem = poem.all()

        if args.get('_order') and args.get('_sort'):
            if args['_order'] == 'ASC':
                poem.sort(key=lambda x:getattr(x,args['_sort']))
            else:
                poem.sort(key=lambda x:getattr(x,args['_sort']), reverse=True)
        if not args.get('_start') is None and not args.get('_end') is None:
            print('rm')
            poem = poem[args['_start']:args['_end']]

        res = jsonify(poems_schema.dump(poem))
        res.headers["X-Total-Count"] = len(poem)
        return res

    def post(self):
        # print("dat:",request.data)
        json_data = json.loads(request.data)
            # recording = recording.query.filter_by(filepath=json_file.get('title')).first()
            # res = jsonify(recording_schema.dump(recording))
            # return res
        # json_data = request.form.to_dict()
        # print(json_data)
        if not json_data:
            return {'message': 'no input data provided'}, 400
        name = json_data['name']
        # data, errors = record_schema.load(json_data)
        # if errors:
            # return errors, 422
        poem = Poem(#filepath=os.path.join(os.getcwd(),"static",filename+".webm"),
                name=json_data['name']
                )
        db.session.add(poem)
        db.session.commit()
        res = jsonify(poem_schema.dump(poem))
        return res 


# Route
api.add_resource(Hello, '/Hello')
api.add_resource(RecordingResource, '/recordings')
api.add_resource(GetRecordingResource, '/recordings/<recording_id>')
api.add_resource(LangagesResource, '/langages')
api.add_resource(GetLangResource, '/langages/<lang_id>')
api.add_resource(PoemsResource, '/poems')
api.add_resource(GetPoemResource, '/poems/<poem_id>')
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
