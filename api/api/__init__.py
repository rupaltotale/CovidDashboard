from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import time

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///site.db"
db = SQLAlchemy(app)

from api.models import User, Post
from api import routes
