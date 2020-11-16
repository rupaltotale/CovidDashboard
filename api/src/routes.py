from flask import Flask, url_for, flash, redirect
import time
from src import app
from src import db
from src.models import RaceEntry
from sqlalchemy import func
from flask import jsonify


@app.route('/get-total-cases-by-state')
def get_total_cases_by_state():
    results = db.session.query(RaceEntry.state,
                               func.sum(RaceEntry.cases_total),
                               func.sum(RaceEntry.deaths_total),
                               ).group_by(RaceEntry.state
                                          ).order_by(func.sum(RaceEntry.cases_total).desc()
                                                     ).limit(10)

    return jsonify(
        state=[e[0] for e in results.all()],
        cases=[e[1] for e in results.all()],
        deaths=[e[2] for e in results.all()],)


@app.route('/get-total-cases-by-date')
def get_total_cases_by_date():
    results = db.session.query(RaceEntry.date,
                               func.sum(RaceEntry.cases_total),
                               func.sum(RaceEntry.deaths_total),
                               ).group_by(RaceEntry.date)
    return jsonify(
        date=[e[0] for e in results.all()],
        cases=[e[1] for e in results.all()],
        deaths=[e[2] for e in results.all()],)


@app.route('/get-total-cases-by-date-for-state')
def get_total_cases_by_date_for_state():
    results = db.session.query(RaceEntry.date,
                               func.sum(RaceEntry.cases_total),
                               func.sum(RaceEntry.deaths_total),
                               ).group_by(RaceEntry.date)
    return jsonify(
        date=[e[0] for e in results.all()],
        cases=[e[1] for e in results.all()],
        deaths=[e[2] for e in results.all()],)


@app.route('/get-cases-by-date-and-race')
def get_cases_by_date_and_race():
    results = db.session.query(RaceEntry.date,
                               func.sum(RaceEntry.cases_white),
                               func.sum(RaceEntry.cases_black),
                               func.sum(RaceEntry.cases_latino),
                               func.sum(RaceEntry.cases_multiracial)
                               ).group_by(RaceEntry.date)
    return jsonify(
        date=[e[0] for e in results.all()],
        white=[e[1] for e in results.all()],
        black=[e[2] for e in results.all()],
        latino=[e[3] for e in results.all()],
        multi=[e[4] for e in results.all()])

@app.route('/get-deaths-by-date-and-race')
def get_deaths_by_date_and_race():
    results = db.session.query(RaceEntry.date,
                               func.sum(RaceEntry.deaths_white),
                               func.sum(RaceEntry.deaths_black),
                               func.sum(RaceEntry.deaths_latino),
                               func.sum(RaceEntry.deaths_multiracial)
                               ).group_by(RaceEntry.date)
    return jsonify(
        date=[e[0] for e in results.all()],
        white=[e[1] for e in results.all()],
        black=[e[2] for e in results.all()],
        latino=[e[3] for e in results.all()],
        multi=[e[4] for e in results.all()])