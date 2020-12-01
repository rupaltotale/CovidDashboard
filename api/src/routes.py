from flask import Flask, url_for, flash, redirect
import time
from src import app
from src import db
from src.models import RaceEntry, StateEntry
from sqlalchemy import func
from flask import jsonify
from flask import request
import datetime


@app.route('/get-data')
def get_data():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    state = request.args.get('state')
    results = db.session.query(RaceEntry.date,
                               func.sum(RaceEntry.cases_total),
                               func.sum(RaceEntry.cases_white),
                               func.sum(RaceEntry.cases_black),
                               func.sum(RaceEntry.cases_latino),
                               func.sum(RaceEntry.cases_multiracial),
                               func.sum(RaceEntry.deaths_total),
                               func.sum(RaceEntry.deaths_white),
                               func.sum(RaceEntry.deaths_black),
                               func.sum(RaceEntry.deaths_latino),
                               func.sum(RaceEntry.deaths_multiracial)
                               ).group_by(RaceEntry.date).filter(RaceEntry.date >= start_date
                                                                 ).filter(RaceEntry.date <= end_date)
    if state != "National":
        results = results.filter(RaceEntry.state == db.session.query(StateEntry.state_abbreviation
                                                                     ).filter(StateEntry.state_name == state))
    return jsonify(
        date=[e[0] for e in results.all()],

        cases_total=[e[1] for e in results.all()],
        cases_white=[e[2] for e in results.all()],
        cases_black=[e[3] for e in results.all()],
        cases_latino=[e[4] for e in results.all()],
        cases_multi=[e[5] for e in results.all()],

        deaths_total=[e[6] for e in results.all()],
        deaths_white=[e[7] for e in results.all()],
        deaths_black=[e[8] for e in results.all()],
        deaths_latino=[e[9] for e in results.all()],
        deaths_multi=[e[10] for e in results.all()])


@app.route('/get-data-for-locations')
def get_data_for_locations():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    states = request.args.get('states').split(",")
    states_abbrs = db.session.query(StateEntry.state_abbreviation).filter(StateEntry.state_name.in_(states))
    results = db.session.query(RaceEntry.state, StateEntry.population,
                               func.sum(RaceEntry.cases_total),
                               func.sum(RaceEntry.cases_white),
                               func.sum(RaceEntry.cases_black),
                               func.sum(RaceEntry.cases_latino),
                               func.sum(RaceEntry.cases_multiracial),
                               func.sum(RaceEntry.deaths_total),
                               func.sum(RaceEntry.deaths_white),
                               func.sum(RaceEntry.deaths_black),
                               func.sum(RaceEntry.deaths_latino),
                               func.sum(RaceEntry.deaths_multiracial)
                               ).filter(StateEntry.state_abbreviation == RaceEntry.state
                                        ).group_by(RaceEntry.state
                                          ).filter(end_date > RaceEntry.date
                                                   ).filter(datetime.datetime.strptime(
                                                       end_date, '%Y-%m-%d').date() - datetime.timedelta(days=7) < RaceEntry.date
    ).filter(RaceEntry.state.in_(states_abbrs)
             ).order_by(func.sum(RaceEntry.deaths_total).desc())

    return jsonify(
        state=[e[0] for e in results.all()],
        population=[e[1] for e in results.all()],
        cases_total=[e[2] for e in results.all()],
        cases_white=[e[3] for e in results.all()],
        cases_black=[e[4] for e in results.all()],
        cases_latino=[e[5] for e in results.all()],
        cases_multi=[e[6] for e in results.all()],

        deaths_total=[e[7] for e in results.all()],
        deaths_white=[e[8] for e in results.all()],
        deaths_black=[e[9] for e in results.all()],
        deaths_latino=[e[10] for e in results.all()],
        deaths_multi=[e[11] for e in results.all()])


@app.route('/get-total-cases-by-state')
def get_data_by_state():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    results = db.session.query(RaceEntry.state,
                               func.sum(RaceEntry.cases_total),
                               func.sum(RaceEntry.deaths_total),
                               ).group_by(RaceEntry.state
                                          ).filter(end_date > RaceEntry.date).filter(
        datetime.datetime.strptime(
            end_date, '%Y-%m-%d').date() - datetime.timedelta(days=7) < RaceEntry.date
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
                                                                 ).filter(RaceEntry.date <= end_date
                                                                          ).filter(RaceEntry.state == state)
    return jsonify(
        date=[e[0] for e in results.all()],
        cases=[e[1] for e in results.all()],
        deaths=[e[2] for e in results.all()],)


@app.route('/get-cases-by-date-and-race-for-state/<string:state>')
def get_cases_by_date_and_race_for_state(state):
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    results = db.session.query(RaceEntry.date,
                               func.sum(RaceEntry.cases_white),
                               func.sum(RaceEntry.cases_black),
                               func.sum(RaceEntry.cases_latino),
                               func.sum(RaceEntry.cases_multiracial)
                               ).group_by(RaceEntry.date).filter(RaceEntry.date >= start_date
                                                                 ).filter(RaceEntry.date <= end_date
                                                                          ).filter(RaceEntry.state == state)
    return jsonify(
        date=[e[0] for e in results.all()],
        white=[e[1] for e in results.all()],
        black=[e[2] for e in results.all()],
        latino=[e[3] for e in results.all()],
        multi=[e[4] for e in results.all()])


@app.route('/get-deaths-by-date-and-race-for-state/<string:state>')
def get_deaths_by_date_and_race_for_state(state):
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    results = db.session.query(RaceEntry.date,
                               func.sum(RaceEntry.deaths_white),
                               func.sum(RaceEntry.deaths_black),
                               func.sum(RaceEntry.deaths_latino),
                               func.sum(RaceEntry.deaths_multiracial)
                               ).group_by(RaceEntry.date).filter(RaceEntry.date >= start_date
                                                                 ).filter(RaceEntry.date <= end_date
                                                                          ).filter(RaceEntry.state == state)
    return jsonify(
        date=[e[0] for e in results.all()],
        white=[e[1] for e in results.all()],
        black=[e[2] for e in results.all()],
        latino=[e[3] for e in results.all()],
        multi=[e[4] for e in results.all()])


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
        datetime.datetime.strptime(
            end_date, '%Y-%m-%d').date() - datetime.timedelta(days=7) < RaceEntry.date
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
        datetime.datetime.strptime(
            end_date, '%Y-%m-%d').date() - datetime.timedelta(days=7) < RaceEntry.date
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


@app.route('/get-states-with-coord-data')
def get_states_with_coord_data():
    results = db.session.query(StateEntry.state_name,
                               StateEntry.latitude,
                               StateEntry.longitude,
                               StateEntry.state_abbreviation,
                               StateEntry.population)
    return jsonify(
        {
            "name": e[0],
            "latitude": e[1],
            "longitude": e[2],
            "abbr": e[3],
            "population": e[4]
        } for e in results.all())


@app.route('/get-state-population')
def get_state_population():
    results = db.session.query(StateEntry.state_name,
                               StateEntry.population)
    return jsonify(
        state_name=[e[0] for e in results.all()],
        population=[e[1] for e in results.all()])


@app.route('/get-all-states')
def get_states():
    results = db.session.query(StateEntry.state_name)
    return jsonify(e[0] for e in results.all())

@app.route('/get-all-states-mapping')
def get_states_mapping():
    results = db.session.query(StateEntry.state_name, StateEntry.state_abbreviation)
    return jsonify(
        state_name=[e[0] for e in results.all()],
        state_abbreviation=[e[1] for e in results.all()])
