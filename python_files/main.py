from flask import Flask, render_template, url_for, request
from util import json_response

import data_handler

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-statuses")
@json_response
def get_statuses():
    return data_handler.get_statuses()


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route("/get-cards")
@json_response
def get_cards():
    return data_handler.get_cards()


@app.route("/create-new-board", methods=['POST'])
@json_response
def create_new_board():
    board_title = request.get_json()
    return data_handler.add_board(board_title)


@app.route("/add-card", methods=['POST'])
@json_response
def add_new_card():
    card_info = request.get_json()
    board_id = card_info['board_id']
    title = card_info['title']
    status_id = card_info['status_id']
    return data_handler.insert_new_card(board_id, title, status_id)


@app.route("/rename-board", methods=['PUT'])
@json_response
def rename_board():
    board_info = request.get_json()
    board_id = board_info['board_id']
    new_title = board_info['title']
    data_handler.rename_board(board_id, new_title)
    return board_id


@app.route('/change-board-visibility', methods=['PUT'])
@json_response
def change_board_visibility():
    board_id = request.get_json()
    data_handler.change_board_status(board_id)
    return board_id


@app.route('/add-column', methods=['POST'])
@json_response
def add_column():
    data = request.get_json()
    board_id = data['board_id']
    column_title = data['title']
    column_id = data_handler.insert_new_column(board_id, column_title)
    return column_id


@app.route("/rename-column", methods=['PUT'])
@json_response
def rename_column():
    board_info = request.get_json()
    board_id = board_info['board_id']
    new_title = board_info['title']
    status_id = board_info['status_id']
    status_id = data_handler.rename_column(board_id, status_id, new_title)
    return board_id, status_id


@app.route("/rename-card", methods=['PUT'])
@json_response
def rename_card():
    card_info = request.get_json()
    title = card_info['title']
    card_id = card_info['card_id']
    data_handler.update_card_title(card_id, title)
    return card_id


@app.route("/update-card", methods=['PUT'])
@json_response
def update_card():
    card_info = request.get_json()
    position = card_info['position']
    card_id = card_info['card_id']
    column_id = card_info['columnId']
    data_handler.update_card_position(card_id, position, column_id)
    return card_id


@app.route("/delete-board", methods=['DELETE'])
@json_response
def delete_board():
    card_info = request.get_json()
    board_id = card_info['board_id']
    data_handler.delete_board(board_id)
    return board_id


@app.route("/delete-column", methods=['DELETE'])
@json_response
def delete_column():
    card_info = request.get_json()
    status_id = card_info['status_id']
    board_id = card_info['board_id']
    data_handler.delete_column_board_pair(board_id, status_id)
    data_handler.delete_cards_from_column(board_id, status_id)
    return board_id, status_id


@app.route("/delete-card", methods=['DELETE'])
@json_response
def delete_card():
    card_info = request.get_json()
    card_id = card_info['card_id']
    data_handler.delete_card(card_id)
    return card_id


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
