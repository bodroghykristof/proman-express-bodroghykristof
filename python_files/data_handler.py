from psycopg2 import sql
import connection
from psycopg2 import errors


@connection.connection_handler
def get_boards(cursor):
    query = """
            SELECT * FROM {board}
            ORDER BY id
            """
    cursor.execute(sql.SQL(query).format(board=sql.Identifier("board")))
    return cursor.fetchall()


@connection.connection_handler
def get_cards(cursor):
    query = """
                SELECT card.id AS id, 
                        card.board_id AS board_id, 
                        card.title AS title,
                        card.order_by_position AS position,
                        status.id As status_id,
                        status.name AS status
                    FROM card
                LEFT JOIN status ON card.status_id = status.id
                ORDER BY card.order_by_position ASC
                """
    cursor.execute(query)
    return cursor.fetchall()


@connection.connection_handler
def get_statuses(cursor):
    query = """
            SELECT status.name AS name,
                    status.id AS id,
                    column_in_board.board_id AS board_id,
                    board.is_active AS active
                FROM column_in_board
            LEFT JOIN status on column_in_board.status_id = status.id 
            LEFT JOIN board on column_in_board.board_id = board.id
            ORDER BY order_by_position
            """
    cursor.execute(query)
    return cursor.fetchall()


@connection.connection_handler
def add_board(cursor, title):
    query = """
            INSERT INTO board(title)
            VALUES ({title})
            RETURNING id
            """
    cursor.execute(sql.SQL(query).format(title=sql.Literal(title)))
    board_info = cursor.fetchone()
    add_columns(board_info['id'], [0, 1, 2, 3])
    return board_info['id']


@connection.connection_handler
def add_columns(cursor, board_id, status_ids):
    query = """
                        INSERT INTO column_in_board(board_id, status_id, order_by_position)
                        VALUES ({board_id}, {status_id}, {status_id} + 1)
                        """
    for status_id in status_ids:
        cursor.execute(sql.SQL(query).format(board_id=sql.Literal(board_id),
                                             status_id=sql.Literal(int(status_id))))


@connection.connection_handler
def rename_board(cursor, board_id, new_board_name):
    query = '''
        UPDATE board
        SET title = %(new_board_name)s
        WHERE id = %(board_id)s
    '''
    cursor.execute(query, {'new_board_name': new_board_name, 'board_id': board_id})


@connection.connection_handler
def change_board_status(cursor, board_id):
    query = '''
        UPDATE board
        SET is_active = NOT is_active
        WHERE id = %(board_id)s    
    '''
    cursor.execute(query, {'board_id': board_id})


def insert_new_column(board_id, column_name):
    column_id = get_column_id_by_name(column_name)
    if not column_id and column_id != 0:
        column_id = register_new_column(column_name)
    add_new_board_column_pair(board_id, column_id)
    return column_id


@connection.connection_handler
def get_column_id_by_name(cursor, column_name):
    query = '''
        SELECT id
        FROM status
        WHERE name = %(column_name)s    
    '''
    cursor.execute(query, {'column_name': column_name})
    record = cursor.fetchone()
    if record:
        return record['id']


@connection.connection_handler
def register_new_column(cursor, column_name):
    query = """
            INSERT INTO status(name)
            VALUES ({column_name})
            RETURNING id
            """
    cursor.execute(sql.SQL(query).format(column_name=sql.Literal(column_name)))
    return cursor.fetchone()['id']


@connection.connection_handler
def add_new_board_column_pair(cursor, board_id, column_id):
    query = """
            INSERT INTO column_in_board(board_id, status_id, order_by_position )
            SELECT {board_id}, {status_id},  MAX(order_by_position)+ 1
                        FROM column_in_board
            """
    cursor.execute(sql.SQL(query).format(board_id=sql.Literal(board_id),
                                         status_id=sql.Literal(column_id)))


@connection.connection_handler
def update_board_column_pair(cursor, board_id, column_id, new_column_id):
    query = """UPDATE column_in_board
                SET status_id = {new_column_id}
                WHERE board_id = {board_id} AND status_id = {column_id} """
    cursor.execute(sql.SQL(query).format(board_id=sql.Literal(board_id),
                                         column_id=sql.Literal(column_id),
                                         new_column_id=sql.Literal(new_column_id)))


def rename_column(board_id, original_column_id, column_name):
    new_column_id = get_column_id_by_name(column_name)
    if not new_column_id and new_column_id != 0:
        new_column_id = register_new_column(column_name)
    if new_column_id != int(original_column_id):
        # add_new_board_column_pair(board_id, new_column_id)
        update_board_column_pair(board_id, original_column_id, new_column_id)
        update_card_status(board_id, original_column_id, new_column_id)
    return new_column_id


@connection.connection_handler
def update_card_status(cursor, board_id, original_column_id, new_column_id):
    query = """
                UPDATE card
                SET status_id = {new_column_id}
                WHERE board_id = {board_id} AND status_id = {column_id}"""
    cursor.execute(sql.SQL(query).format(board_id=sql.Literal(board_id),
                                         column_id=sql.Literal(original_column_id),
                                         new_column_id=sql.Literal(new_column_id)))


@connection.connection_handler
def insert_new_card(cursor, board_id, title, status_id):
    query = """
            INSERT INTO card(title, board_id, status_id, order_by_position)
            SELECT {title}, {board_id}, {status_id}, MAX(order_by_position) + 1
            FROM card
            RETURNING id, order_by_position
            """
    cursor.execute(sql.SQL(query).format(title=sql.Literal(title),
                                         board_id=sql.Literal(board_id),
                                         status_id=sql.Literal(status_id)))
    info = cursor.fetchone()
    return info


@connection.connection_handler
def update_card_title(cursor, card_id, new_title):
    query = """
                    UPDATE card
                    SET title = {new_title}
                    WHERE id = {card_id}
                    """
    cursor.execute(sql.SQL(query).format(card_id=sql.Literal(int(card_id)),
                                         new_title=sql.Literal(new_title)))


@connection.connection_handler
def update_card_position(cursor, card_id, position, status_id):
    query = """
                    UPDATE card
                    SET order_by_position = {position}, status_id = {status_id}
                    WHERE id = {card_id}
                    """
    cursor.execute(sql.SQL(query).format(card_id=sql.Literal(int(card_id)),
                                         position=sql.Literal(int(position)),
                                         status_id=sql.Literal(int(status_id))))


@connection.connection_handler
def delete_board(cursor, board_id):
    query = """
                    DELETE FROM board
                    WHERE id = {board_id};
                    """
    cursor.execute(sql.SQL(query).format(board_id=sql.Literal(int(board_id))))


@connection.connection_handler
def delete_column_board_pair(cursor, board_id, column_id):
    query = """
                    DELETE FROM column_in_board
                    WHERE board_id = {board_id} AND status_id = {column_id};
                    """
    cursor.execute(sql.SQL(query).format(board_id=sql.Literal(int(board_id)),
                                         column_id=sql.Literal(int(column_id))))


@connection.connection_handler
def delete_cards_from_column(cursor, board_id, column_id):
    query = """
                    DELETE FROM card
                    WHERE board_id = {board_id} AND status_id = {column_id};
                    """
    cursor.execute(sql.SQL(query).format(board_id=sql.Literal(int(board_id)),
                                         column_id=sql.Literal(int(column_id))))


@connection.connection_handler
def delete_card(cursor, card_id):
    query = """
                    DELETE FROM card
                    WHERE id = {card_id};
                    """
    cursor.execute(sql.SQL(query).format(card_id=sql.Literal(int(card_id))))