from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"

# Order matters: Initialize SQLAlchemy before Marshmallow
db = SQLAlchemy(app)
ma = Marshmallow(app)

class Record(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filepath = db.Column(db.String, unique=True, nullable=False)
    lang = db.Column(db.String, nullable=False)
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


class BookSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Record
        include_fk = True

class EntrySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Entry
        include_fk = True
