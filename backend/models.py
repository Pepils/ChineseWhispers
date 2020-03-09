from run import app,db,ma,migrate
from marshmallow import EXCLUDE

class Poem(db.Model):
    id = db.Column(db.Integer, primary_key=True)

class Lang(db.Model):
    # id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, primary_key=True, unique=True)

class Recording(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    # lang = db.Column(db.String)
    lang = db.Column(db.Text, db.ForeignKey('lang.name'))
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
    class Meta:
        model = Recording
        unknown = EXCLUDE
        include_fk = True

class LangSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Lang
        # unknown = EXCLUDE
        include_fk = True

