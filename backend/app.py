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
        try:
            data = recording_schema.load(json_data, partial=True)
        except exceptions.ValidationError as err:
            return { 'message': err }, 422
        recording = Recording.query.filter_by(id=recording_id).first()
        if not recording:
            return {'message': 'Recording does not exist'}, 400
        RecordingSchema().update(recording, data)
        db.session.commit()
        res = jsonify(recording_schema.dump(recording))
        return res 

    def delete(self, recording_id):
        recording = Recording.query.filter_by(id=recording_id).delete()
        db.session.commit()
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
            recordings = recordings[args['_start']:args['_end']]

        res = jsonify(recordings_schema.dump(recordings))
        res.headers["X-Total-Count"] = len(recordings)
        return res

    def post(self):
        # print("dat:",request.data)
        # print("form:",request.form)
        # print("files:",request.files)
        if request.data != b'':
            json_file = request.get_json().get('filepath')
            recording = Recording.query.filter_by(filepath=json_file.get('title')).first()
            res = jsonify(recording_schema.dump(recording))
            return res
        json_data = request.form.to_dict()
        if not json_data:
            return {'message': 'no input data provided'}, 400
        file = request.files['file']
        if not file:
            return {'message': 'no input file provided'}, 400
        filepath = json_data['filepath']
        file.save(os.path.join(os.getcwd(),"static",filepath))
        try:
            data = recording_schema.load(json_data)
        except exceptions.ValidationError as err:
            return { 'status': 400, 'message': err }, 400
        db.session.add(data)
        db.session.commit()
        res = jsonify(recording_schema.dump(data))
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
            lang = lang[args['_start']:args['_end']]

        res = jsonify(langs_schema.dump(lang))
        res.headers["X-Total-Count"] = len(lang)
        return res

    def post(self):
        json_data = request.get_json()
        if not json_data:
            return {'message': 'no input data provided'}, 400
        try:
            data = lang_schema.load(json_data, partial=True)
        except exceptions.ValidationError as err:
            return { 'message' : err }, 422
        db.session.add(data)
        db.session.commit()
        res = jsonify(lang_schema.dump(data))
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
        try:
            data = lang_schema.load(json_data, partial=True)
        except exceptions.ValidationError as err:
            return { 'message' : err }, 422
        lang = Lang.query.filter_by(id=lang_id).first()
        if not lang:
            return {'message': 'Lang does not exist'}, 400
        LangSchema().update(lang, data)
        db.session.commit()
        res = jsonify(lang_schema.dump(lang))
        return res 
    
    def delete(self, lang_id):
        lang = Lang.query.filter_by(id=lang_id).delete()
        db.session.commit()
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
        try:
            data = poem_schema.load(json_data, partial=True)
        except exceptions.ValidationError as err:
            return { 'message': err }, 422
        poem = Poem.query.filter_by(id=poem_id).first()
        if not poem:
            return {'message': 'Poem does not exist'}, 400
        PoemSchema().update(poem, data)
        db.session.commit()
        res = jsonify(poem_schema.dump(poem))
        return res 
    
    def delete(self, poem_id):
        poem = Poem.query.filter_by(id=poem_id).delete()
        db.session.commit()
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
            poem = poem[args['_start']:args['_end']]

        res = jsonify(poems_schema.dump(poem))
        res.headers["X-Total-Count"] = len(poem)
        return res

    def post(self):
        json_data = request.get_json()
        if not json_data:
            return {'message': 'no input data provided'}, 400
        try:
            data = poem_schema.load(json_data, partial=True)
        except exceptions.ValidationError as err:
            return { 'message' : err }, 422
        db.session.add(data)
        db.session.commit()
        res = jsonify(poem_schema.dump(data))
        return res 

# Route
api.add_resource(Hello, '/Hello')
api.add_resource(RecordingResource, '/recordings')
api.add_resource(GetRecordingResource, '/recordings/<recording_id>')
api.add_resource(LangagesResource, '/langages')
api.add_resource(GetLangResource, '/langages/<lang_id>')
api.add_resource(PoemsResource, '/poems')
api.add_resource(GetPoemResource, '/poems/<poem_id>')

@app.route('/files/<path:filename>')
def download_file(filename):
    print(filename)
    return send_from_directory(os.getcwd()+"/static/", filename, as_attachment=True)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
