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




INSERT INTO public.board (id, title, is_active) VALUES (1, 'Germany WW2', true);
INSERT INTO public.board (id, title, is_active) VALUES (2, 'Napoleon', true);

INSERT INTO public.status (id, name) VALUES (0, 'Ally');
INSERT INTO public.status (id, name) VALUES (1, 'Neutral');
INSERT INTO public.status (id, name) VALUES (2, 'Enemy');
INSERT INTO public.status (id, name) VALUES (3, 'Occupied');

INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (1, 'Japan', 1, 0, 0);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (2, 'Italy', 1, 0, 1);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (3, 'Switzerland', 1, 1, 0);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (4, 'Soviet Union', 1, 2, 0);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (5, 'France', 1, 3, 0);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (6, 'Poland', 1, 3, 1);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (7, 'Netherlands', 2, 0, 0);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (8, 'Baverian Kingdom', 2, 0, 1);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (9, 'Switzerland', 2, 1, 0);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (10, 'Habsburg Empire', 2, 2, 0);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (11, 'Spain', 2, 3, 0);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (12, 'Sardinia', 2, 3, 1);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (13, 'USA', 1, 2, 1);
INSERT INTO public.card (id, title, board_id, status_id, order_by_position) VALUES (14, 'UK', 1, 2, 2);

INSERT INTO public.column_in_board (board_id, status_id, order_by_position) VALUES (1, 0, 1);
INSERT INTO public.column_in_board (board_id, status_id, order_by_position) VALUES (1, 1, 2);
INSERT INTO public.column_in_board (board_id, status_id, order_by_position) VALUES (1, 2, 3);
INSERT INTO public.column_in_board (board_id, status_id, order_by_position) VALUES (1, 3, 4);
INSERT INTO public.column_in_board (board_id, status_id, order_by_position) VALUES (2, 0, 1);
INSERT INTO public.column_in_board (board_id, status_id, order_by_position) VALUES (2, 1, 2);
INSERT INTO public.column_in_board (board_id, status_id, order_by_position) VALUES (2, 2, 3);
INSERT INTO public.column_in_board (board_id, status_id, order_by_position) VALUES (2, 3, 4);

SELECT pg_catalog.setval('board_id_seq', 2, TRUE);
SELECT pg_catalog.setval('status_id_seq', 3, TRUE);
SELECT pg_catalog.setval('card_id_seq', 14, TRUE);