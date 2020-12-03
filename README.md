# Covid Dashboard

## Running the frontend

- Install all neccesary frontend packages using `npm install`
- Start the app with `npm start`
- Navigate to `http://localhost:3000/CovidDashboard#/` to see the landing page of the app
- The previous home page is located at `http://localhost:3000/CovidDashboard#/previous`

To see the graphs, the flask app must be started

## Running the flask app (backend)

- Navigate to the api: `cd api`
- Create a virtual environment using `python3 -m venv venv`
- Activate the virtual environment using `source venv/bin/activate`
- Install the needed packages using pip/pip3: `pip install flask python-dotenv Flask-SQLAlchemy click requests SQLAlchemy urllib3`
- To seed the database with the latest data, run `flask create`
- To start the flask app, run `flask run`

## Structure of the project

- The frontend code (React) is mainly located under `src/`
- The backend code (Flask) is located under `api/src`
