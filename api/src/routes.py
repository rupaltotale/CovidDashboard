from flask import Flask, url_for, flash, redirect
import time
from src import app
from src import db
from src.models import RaceEntry
from sqlalchemy import func
from flask import jsonify
from flask import request
import datetime


@app.route('/get-total-cases-by-state')
def get_data_by_state():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    results = db.session.query(RaceEntry.state,
                               func.sum(RaceEntry.cases_total),
                               func.sum(RaceEntry.deaths_total),
                               ).group_by(RaceEntry.state
                                          ).filter(end_date > RaceEntry.date).filter(
        datetime.datetime.strptime(end_date, '%Y-%m-%d').date() - datetime.timedelta(days=7) < RaceEntry.date
    ).order_by(func.sum(RaceEntry.cases_total).desc()).limit(10)
    return jsonify(
        state=[e[0] for e in results.all()],
        cases=[e[1] for e in results.all()],
        deaths=[e[2] for e in results.all()],)


@app.route('/get-total-cases-by-date')
def get_data_by_date():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    results = db.session.query(RaceEntry.date,
                               func.sum(RaceEntry.cases_total),
                               func.sum(RaceEntry.deaths_total),
                               ).group_by(RaceEntry.date
                                          ).filter(RaceEntry.date >= start_date
                                                                 ).filter(RaceEntry.date <= end_date)
    return jsonify(
        date=[e[0] for e in results.all()],
        cases=[e[1] for e in results.all()],
        deaths=[e[2] for e in results.all()],)


@app.route('/get-total-cases-by-date-for-state/<string:state>')
def get_data_by_date_for_state(state):
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    results = db.session.query(RaceEntry.date,
                               func.sum(RaceEntry.cases_total),
                               func.sum(RaceEntry.deaths_total),
                               ).group_by(RaceEntry.date).filter(RaceEntry.date >= start_date
                                                                 ).filter(RaceEntry.date <= end_date)
    return jsonify(
        date=[e[0] for e in results.all()],
        cases=[e[1] for e in results.all()],
        deaths=[e[2] for e in results.all()],)


@app.route('/get-cases-by-date-and-race')
def get_cases_by_date_and_race():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    results = db.session.query(RaceEntry.date,
                               func.sum(RaceEntry.cases_white),
                               func.sum(RaceEntry.cases_black),
                               func.sum(RaceEntry.cases_latino),
                               func.sum(RaceEntry.cases_multiracial)
                               ).group_by(RaceEntry.date).filter(RaceEntry.date >= start_date
                                                                 ).filter(RaceEntry.date <= end_date)
    return jsonify(
        date=[e[0] for e in results.all()],
        white=[e[1] for e in results.all()],
        black=[e[2] for e in results.all()],
        latino=[e[3] for e in results.all()],
        multi=[e[4] for e in results.all()])

@app.route('/get-cases-by-state-and-race')
def get_cases_by_state_and_race():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    results = db.session.query(RaceEntry.state,
                               func.sum(RaceEntry.cases_white),
                               func.sum(RaceEntry.cases_black),
                               func.sum(RaceEntry.cases_latino),
                               func.sum(RaceEntry.cases_multiracial)
                               ).group_by(RaceEntry.state).filter(end_date > RaceEntry.date).filter(
        datetime.datetime.strptime(end_date, '%Y-%m-%d').date() - datetime.timedelta(days=7) < RaceEntry.date
    ).order_by(func.sum(RaceEntry.cases_total).desc()).limit(10)
    return jsonify(
        state=[e[0] for e in results.all()],
        white=[e[1] for e in results.all()],
        black=[e[2] for e in results.all()],
        latino=[e[3] for e in results.all()],
        multi=[e[4] for e in results.all()])

@app.route('/get-deaths-by-state-and-race')
def get_deaths_by_state_and_race():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    results = db.session.query(RaceEntry.state,
                               func.sum(RaceEntry.deaths_white),
                               func.sum(RaceEntry.deaths_black),
                               func.sum(RaceEntry.deaths_latino),
                               func.sum(RaceEntry.deaths_multiracial)
                               ).group_by(RaceEntry.state).filter(end_date > RaceEntry.date).filter(
        datetime.datetime.strptime(end_date, '%Y-%m-%d').date() - datetime.timedelta(days=7) < RaceEntry.date
    ).order_by(func.sum(RaceEntry.deaths_total).desc()).limit(10)
    return jsonify(
        state=[e[0] for e in results.all()],
        white=[e[1] for e in results.all()],
        black=[e[2] for e in results.all()],
        latino=[e[3] for e in results.all()],
        multi=[e[4] for e in results.all()])


@app.route('/get-deaths-by-date-and-race')
def get_deaths_by_date_and_race():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    results = db.session.query(RaceEntry.date,
                               func.sum(RaceEntry.deaths_white),
                               func.sum(RaceEntry.deaths_black),
                               func.sum(RaceEntry.deaths_latino),
                               func.sum(RaceEntry.deaths_multiracial)
                               ).group_by(RaceEntry.date).filter(RaceEntry.date >= start_date
                                                                 ).filter(RaceEntry.date <= end_date)
    return jsonify(
        date=[e[0] for e in results.all()],
        white=[e[1] for e in results.all()],
        black=[e[2] for e in results.all()],
        latino=[e[3] for e in results.all()],
        multi=[e[4] for e in results.all()])


@app.route('/get-date-range')
def get_date_range():
    results = db.session.query(func.max(RaceEntry.date),
                               func.min(RaceEntry.date))
    return jsonify(
        start_date=[e[1] for e in results.all()],
        end_date=[e[0] for e in results.all()])