from flask import Flask, url_for, flash, redirect
import time
from src import app
from src import db
from src.models import User, Post


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/user')
def get_first_user():
    user = User.query.first()
    print(user)
    return user.as_dict()
