from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import datetime
import csv
import requests

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///site.db"
db = SQLAlchemy(app)

from src.models import User, Post, RaceEntry
from src import routes


# @app.before_first_request
@app.cli.command('initdb')
def setup():
    print("===> Setting up database")
    # Recreate database each time initdb is called
    db.drop_all()
    db.create_all()

    CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR_xmYt4ACPDZCDJcY12kCiMiH0ODyx3E1ZvgOHB8ae1tRcjXbs_yWBOA4j4uoCEADVfC1PS2jYO68B/pub?gid=43720681&single=true&output=csv'

    with requests.Session() as s:
        download = s.get(CSV_URL, stream=True)

        decoded_content = download.content.decode('utf-8')

        reader = csv.DictReader(decoded_content.splitlines(), delimiter=',')
        for entry in reader:
            #print(datetime.datetime.strptime(entry['Date'], '%Y%m%d').date())
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
    db.session.commit()
