import datetime
from src import db

#
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(20), unique=True, nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#     image_file = db.Column(db.String(20), nullable=False,
#                            default='default.jpg')
#     password = db.Column(db.String(60), nullable=False)
#     posts = db.relationship('Post', backref='author', lazy=True)
#
#     def __repr__(self):
#         return f"User('{self.username}', '{self.email}', '{self.image_file}')"
#
#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}
#
#
# class Post(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     title = db.Column(db.String(20), unique=True, nullable=False)
#     date_posted = db.Column(db.DateTime, nullable=False,
#                             default=datetime.datetime.utcnow)
#     content = db.Column(db.Text, nullable=False)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class RaceEntry(db.Model):
    id = db.Column(db.Integer, nullable=True, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    state = db.Column(db.String(2), nullable=False)
    cases_total = db.Column(db.Integer, nullable=True)
    cases_white = db.Column(db.Integer, nullable=True)
    cases_black = db.Column(db.Integer, nullable=True)
    cases_latino = db.Column(db.Integer, nullable=True)
    cases_AIAN = db.Column(db.Integer, nullable=True)
    cases_NHPI = db.Column(db.Integer, nullable=True)
    cases_multiracial = db.Column(db.Integer, nullable=True)
    cases_other = db.Column(db.Integer, nullable=True)
    cases_unknown = db.Column(db.Integer, nullable=True)
    cases_hispanic = db.Column(db.Integer, nullable=True)
    cases_nonhispanic = db.Column(db.Integer, nullable=True)

    deaths_total = db.Column(db.Integer, nullable=True)
    deaths_white = db.Column(db.Integer, nullable=True)
    deaths_black = db.Column(db.Integer, nullable=True)
    deaths_latino = db.Column(db.Integer, nullable=True)
    deaths_AIAN = db.Column(db.Integer, nullable=True)
    deaths_NHPI = db.Column(db.Integer, nullable=True)
    deaths_multiracial = db.Column(db.Integer, nullable=True)
    deaths_other = db.Column(db.Integer, nullable=True)
    deaths_unknown = db.Column(db.Integer, nullable=True)
    deaths_hispanic = db.Column(db.Integer, nullable=True)
    deaths_nonhispanic = db.Column(db.Integer, nullable=True)

    def __repr__(self):
        return f"\nRaceEntry('{self.date}', '{self.state}', '{self.new_cases}', '{self.deaths_total}')"

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
