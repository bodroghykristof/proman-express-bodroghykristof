ALTER TABLE IF EXISTS ONLY public.status DROP CONSTRAINT IF EXISTS pk_status_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.board DROP CONSTRAINT IF EXISTS pk_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.card DROP CONSTRAINT IF EXISTS pk_card_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.card DROP CONSTRAINT IF EXISTS fk_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.card DROP CONSTRAINT IF EXISTS fk_status_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.column_in_board DROP CONSTRAINT IF EXISTS pk_column_in_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.column_in_board DROP CONSTRAINT IF EXISTS fk_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.column_in_board DROP CONSTRAINT IF EXISTS fk_status_id CASCADE;

DROP TABLE IF EXISTS public.status;
CREATE TABLE status (
    id serial NOT NULL,
    name text
);

DROP TABLE IF EXISTS public.board;
CREATE TABLE board (
    id serial NOT NULL,
    title text,
    is_active boolean NOT NULL DEFAULT true
);

DROP TABLE IF EXISTS public.card;
CREATE TABLE card (
    id serial NOT NULL,
    title text,
    board_id integer,
    status_id integer,
    order_by_position integer
);

DROP TABLE IF EXISTS public.column_in_board;
CREATE TABLE column_in_board (
    board_id integer NOT NULL,
    status_id integer NOT NULL,
    order_by_position integer NOT NULL
);


ALTER TABLE ONLY status
    ADD CONSTRAINT pk_status_id PRIMARY KEY (id);

ALTER TABLE ONLY board
    ADD CONSTRAINT pk_board_id PRIMARY KEY (id);

ALTER TABLE ONLY card
    ADD CONSTRAINT pk_card_id PRIMARY KEY (id);

ALTER TABLE ONLY card
    ADD CONSTRAINT fk_status_id FOREIGN KEY (status_id) REFERENCES status(id) ON DELETE CASCADE;

ALTER TABLE ONLY card
    ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES board(id) ON DELETE CASCADE;

ALTER TABLE ONLY column_in_board
    ADD CONSTRAINT pk_column_in_board_id PRIMARY KEY (board_id, status_id);

ALTER TABLE ONLY column_in_board
    ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES board(id) ON DELETE CASCADE;

ALTER TABLE ONLY column_in_board
    ADD CONSTRAINT fk_status_id FOREIGN KEY (status_id) REFERENCES status(id) ON DELETE CASCADE;


INSERT INTO public.board (id, title, is_active) VALUES (2, 'Friday', true);
INSERT INTO public.board (id, title, is_active) VALUES (5, 'Saturday', true);

INSERT INTO public.status (id, name) VALUES (0, 'Main Stage');
INSERT INTO public.status (id, name) VALUES (1, 'Techno Tent');
INSERT INTO public.status (id, name) VALUES (2, 'Metal Stage');
INSERT INTO public.status (id, name) VALUES (3, 'Retro Stage');
INSERT INTO public.status (id, name) VALUES (4, 'Custom');
INSERT INTO public.status (id, name) VALUES (5, 'New');
INSERT INTO public.status (id, name) VALUES (6, 'gwewg');
INSERT INTO public.status (id, name) VALUES (7, 'Main Stage');
INSERT INTO public.status (id, name) VALUES (8, 'Techno Tent');
INSERT INTO public.status (id, name) VALUES (9, 'Metal Mainstream Stage');
INSERT INTO public.status (id, name) VALUES (10, 'Metal Stage');
INSERT INTO public.status (id, name) VALUES (11, 'Retro Stage');

INSERT INTO public.column_in_board (board_id, status_id, order_by_position) VALUES (2, 7, 1);
INSERT INTO public.column_in_board (board_id, status_id, order_by_position) VALUES (2, 8, 2);
INSERT INTO public.column_in_board (board_id, status_id, order_by_position) VALUES (2, 10, 3);
INSERT INTO public.column_in_board (board_id, status_id, order_by_position) VALUES (2, 11, 4);
INSERT INTO public.column_in_board (board_id, status_id, order_by_position) VALUES (5, 7, 1);
INSERT INTO public.column_in_board (board_id, status_id, order_by_position) VALUES (5, 8, 2);
INSERT INTO public.column_in_board (board_id, status_id, order_by_position) VALUES (5, 10, 3);
INSERT INTO public.column_in_board (board_id, status_id, order_by_position) VALUES (5, 11, 4);

INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (35, 'FFDP', 5, 10, 0);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (37, 'Black Sabbath', 5, 10, 1);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (34, 'Rammstein', 5, 10, 2);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (22, 'Szécsi Pál', 5, 11, 1);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (23, 'Máté Péter', 5, 11, 0);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (24, 'R-GO', 5, 11, 2);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (21, 'Neoton Família', 5, 11, 3);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (16, 'Timmy Trumpet', 2, 8, 0);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (30, 'Martin Garrix', 2, 8, 1);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (25, 'David Guetta', 5, 7, 0);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (27, 'Shakira', 5, 7, 2);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (26, 'Avicii', 5, 7, 1);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (9, 'Dimitri Vegas', 2, 8, 2);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (28, 'Beyoncé', 5, 7, 3);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (31, 'Scooter', 5, 8, 0);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (36, 'Bricklake', 5, 8, 1);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (38, 'DJ Jokó', 5, 8, 2);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (10, 'Hammerfall', 2, 10, 0);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (32, 'Iron Maiden', 2, 10, 2);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (33, 'Metallica', 2, 10, 1);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (7, 'Ed Sheeran', 2, 7, 0);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (15, 'Rihanna', 2, 7, 1);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (29, 'Billie Ellish', 2, 7, 2);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (11, 'Korda György', 2, 11, 0);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (20, 'Fenyő Miklós', 2, 11, 2);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (12, 'Kovács Kati', 2, 11, 1);

SELECT pg_catalog.setval('board_id_seq', 5, TRUE);
SELECT pg_catalog.setval('status_id_seq', 11, TRUE);
SELECT pg_catalog.setval('card_id_seq', 38, TRUE);