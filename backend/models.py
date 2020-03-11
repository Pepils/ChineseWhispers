from run import app,db,ma,migrate,STATIC_URL
from marshmallow import EXCLUDE
from marshmallow import fields
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
    lang_id = db.Column(db.Text, db.ForeignKey('lang.id'))
    lang = db.relationship("Lang", backref="recording") 
    langfam = db.Column(db.String)
    transcript = db.Column(db.Text)
    filepath = db.Column(db.String, unique=True, nullable=False)
    added = db.Column(db.Boolean, nullable=False)
    pending = db.Column(db.Boolean, nullable=False) 
    poem_id = db.Column(db.Integer, db.ForeignKey('poem.id'))
    poem = db.relationship('Poem', backref='recording', lazy=True)
    
    def __repr__(self):
        return '<Recording id {}>'.format(self.id)

class RecordingSchema(ma.SQLAlchemyAutoSchema):
    id = ma.auto_field(dump_only=True)
    url = fields.Method("get_url", dump_only=True)
    
    def get_url(self, obj):
        print(obj)
        if getattr(obj,'filepath'):
            return "{}/{}".format(STATIC_URL,obj.filepath)
        else:
            return "No data"

    class Meta:
        model = Recording
        unknown = EXCLUDE
        include_fk = True

class LangSchema(ma.SQLAlchemyAutoSchema):
    id = ma.auto_field(dump_only=True)
    class Meta:
        model = Lang
        unknown = EXCLUDE
        include_fk = True

