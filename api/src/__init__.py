from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import datetime
import csv
import requests
import click
from flask.cli import with_appcontext
from src.commands import usersbp
from flask.json import JSONEncoder
from datetime import date


class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        try:
            if isinstance(obj, date):
                return obj.isoformat()
            iterable = iter(obj)
        except TypeError:
            pass
        else:
            return list(iterable)
        return JSONEncoder.default(self, obj)


app = Flask(__name__)
app.register_blueprint(usersbp)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///site.db"
db = SQLAlchemy(app)
app.json_encoder = CustomJSONEncoder

from src import routes
from src.models import RaceEntry, StateEntry

@click.command(name='create')
@with_appcontext
def create():
    print("===> Setting up database")
    # Recreate database each time initdb is called
    db.drop_all()
    db.create_all()

    CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR_xmYt4ACPDZCDJcY12kCiMiH0ODyx3E1ZvgOHB8ae1tRcjXbs_yWBOA4j4uoCEADVfC1PS2jYO68B/pub?gid=43720681&single=true&output=csv'
    STATE_DATA_CSV_URL = 'https://docs.google.com/spreadsheets/d/1VnQ6m8i78LE5wi56M2YyKAHQm-13zKIvQ5MvYMasSmY/export?format=csv&gid=784984593'

    with requests.Session() as s:
        download = s.get(CSV_URL, stream=True)

        decoded_content = download.content.decode('utf-8')

        reader = csv.DictReader(decoded_content.splitlines(), delimiter=',')
        for entry in reader:
            # print(datetime.datetime.strptime(entry['Date'], '%Y%m%d').date())
            db_entry = RaceEntry(
                date=datetime.datetime.strptime(
                    entry['Date'], '%Y%m%d').date(),
                state=entry['State'],
                cases_total=entry['Cases_Total'],
                cases_white=entry['Cases_White'],
                cases_black=entry['Cases_Black'],
                cases_latino=entry['Cases_LatinX'],
                cases_AIAN=entry['Cases_AIAN'],
                cases_NHPI=entry['Cases_NHPI'],
                cases_multiracial=entry['Cases_Multiracial'],
                cases_other=entry['Cases_Other'],
                cases_unknown=entry['Cases_Unknown'],
                cases_hispanic=entry['Cases_Ethnicity_Hispanic'],
                cases_nonhispanic=entry['Cases_Ethnicity_NonHispanic'],

                deaths_total=entry['Deaths_Total'],
                deaths_white=entry['Deaths_White'],
                deaths_black=entry['Deaths_Black'],
                deaths_latino=entry['Deaths_LatinX'],
                deaths_AIAN=entry['Deaths_AIAN'],
                deaths_NHPI=entry['Deaths_NHPI'],
                deaths_multiracial=entry['Deaths_Multiracial'],
                deaths_other=entry['Deaths_Other'],
                deaths_unknown=entry['Deaths_Unknown'],
                deaths_hispanic=entry['Deaths_Ethnicity_Hispanic'],
                deaths_nonhispanic=entry['Deaths_Ethnicity_NonHispanic'],
            )
            db.session.add(db_entry)

        download = s.get(STATE_DATA_CSV_URL, stream=True)

        decoded_content = download.content.decode('utf-8')

        reader = csv.DictReader(decoded_content.splitlines(), delimiter=',')
        for entry in reader:
            db_entry = StateEntry(
                population=int(entry['population'].replace(",", "")),
                latitude=entry['latitude'],
                longitude=entry['longitude'],
                state_abbreviation=entry['state'],
                state_name=entry['name'],
                city=entry['city']
            )
            db.session.add(db_entry)

    db.session.commit()


app.cli.add_command(create)
