import click
from flask import Blueprint

usersbp = Blueprint('users', __name__)

@usersbp.cli.command('create')
@click.argument('name')
def create(name):
    """ Creates a user """
    print("Create user: {}".format(name))