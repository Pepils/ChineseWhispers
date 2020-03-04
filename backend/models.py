from run import app,db,ma,migrate
from marshmallow import EXCLUDE

class Record(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filepath = db.Column(db.String, unique=True, nullable=False)
    lang = db.Column(db.String, nullable=False)
    langfam = db.Column(db.String, nullable=False)
    added = db.Column(db.Boolean, nullable=False)
    pending = db.Column(db.Boolean, nullable=False) 

    def __repr__(self):
        return '<Record id {}>'.format(self.id)

class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    record_id = db.Column(db.Integer, db.ForeignKey('record.id'), nullable=False)
    record = db.relationship('Record', backref='entry', lazy=True)

    def __repr__(self):
        return '<Entry id {}>'.format(self.id)


class RecordSchema(ma.SQLAlchemyAutoSchema):
    id = ma.auto_field(dump_only=True)
    class Meta:
        model = Record
        unknown = EXCLUDE

class EntrySchema(ma.SQLAlchemyAutoSchema):
    id = ma.auto_field(dump_only=True)
    class Meta:
        model = Entry
        include_fk = True
        unknown = EXCLUDE
        # include_relationships = True
