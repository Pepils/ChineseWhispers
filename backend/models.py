from run import app,db,ma,migrate,STATIC_URL
from marshmallow import EXCLUDE, fields, post_load
from sqlalchemy.ext.hybrid import hybrid_property

class Poem(db.Model):
    id = db.Column(db.Integer, primary_key=True)

class Lang(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, unique=True)

    def __repr__(self):
        return '<Lang: {}>'.format(self.name)

class Recording(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    # lang = db.Column(db.String)
    lang_id = db.Column(db.Integer, db.ForeignKey('lang.id'))
    lang = db.relationship("Lang", backref="recording") 
    langfam = db.Column(db.String)
    transcript = db.Column(db.Text)
    filepath = db.Column(db.String, unique=True, nullable=False)
    added = db.Column(db.Boolean)
    pending = db.Column(db.Boolean) 
    poem_id = db.Column(db.Integer, db.ForeignKey('poem.id'))
    poem = db.relationship('Poem', backref='recording', lazy=True)
    
    def __repr__(self):
        return '<Recording id {}>'.format(self.id)

class RecordingSchema(ma.SQLAlchemyAutoSchema):
    id = ma.auto_field(dump_only=True)
    added = ma.auto_field(missing=False)
    pending = ma.auto_field(missing=True)
    url = fields.Method("get_url", dump_only=True)
    
    def get_url(self, obj):
        # print(obj)
        # if getattr(obj,'filepath'):
            # return "{}/{}".format(STATIC_URL,obj.filepath)
        # else:
        return "No data"

    @post_load
    def make_recording(self, data, **kwargs):
        return Recording(**data)

    class Meta:
        model = Recording
        unknown = EXCLUDE
        include_fk = True

class LangSchema(ma.SQLAlchemyAutoSchema):
    id = ma.auto_field(dump_only=True)

    @post_load
    def make_lang(self, data, **kwargs):
        return Lang(**data)

    class Meta:
        model = Lang
        unknown = EXCLUDE
        include_fk = True

class PoemSchema(ma.SQLAlchemyAutoSchema):
    id = ma.auto_field(dump_only=True)

    @post_load
    def make_poem(self, data, **kwargs):
        return Poem(**data)

    class Meta:
        model = Poem
        unknown = EXCLUDE
        include_fk = True
