from flask import Flask, url_for, flash, redirect
import time
from src import app
from src import db
from src.models import User, Post, RaceEntry
from sqlalchemy import func
from flask import jsonify


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/user')
def get_first_user():
    user = User.query.first()
    print(user)
    return user.as_dict()


@app.route('/get-total-cases-by-state')
def get_total_cases_by_state():
    results = db.session.query(RaceEntry.state,
                               func.sum(RaceEntry.cases_total),
                               func.sum(RaceEntry.deaths_total),
                               ).group_by(RaceEntry.state)
    return jsonify(json_list=results.all())


@app.route('/get-total-cases-by-date')
def get_total_cases_by_date():
    results = db.session.query(RaceEntry.date,
                               func.sum(RaceEntry.cases_total),
                               func.sum(RaceEntry.deaths_total),
                               ).group_by(RaceEntry.date)
    return jsonify(results.all())
