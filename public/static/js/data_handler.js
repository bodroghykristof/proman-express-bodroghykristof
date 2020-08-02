export let dataHandler = {
    _data: {},
    _api_get: function (url, callback) {
        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(json_response => callback(json_response));
    },
    _api_post: function (url, data, callback, errorCallback) {
        fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(json_response => callback(json_response))
        .catch(error => errorCallback(error));
    },
    _api_put: function (url, data, callback, errorCallback) {
        fetch(url, {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(json_response => callback(json_response))
        .catch(error => errorCallback(error));
    },
    _api_delete: function (url, data, callback) {
        fetch(url, {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(json_response => callback(json_response))
    },
    getBoards: function (callback) {
        this._api_get('/boards', (response) => {
            this._data['boards'] = response;
            callback(response);
        });
    },
    createNewBoard: function (boardTitle, callback) {
        this._api_post('/boards', {boardTitle}, (response) => {
            this._data['latest_board_id'] = response;
            callback(response);
        })
    },
    renameBoard: function (title, boardId, callback) {
        this._api_put('/boards', {title, boardId}, (response) => {
            this._data['updated_board_id'] = response;
            callback(response);
        })
    },
    deleteBoard: function (boardId, callback) {
        this._api_delete('/boards', {boardId}, (response) => {
            this._data['deleted_board_id'] = response;
            callback(response);
        })
    },
    changeBoardVisibility: function (boardId) {
        this._api_put('/boards/visibility', {boardId}, (response) => {
            this._data['updated_visibility_board_id'] = response;
        })
    },
    getColumns: function (callback) {
        this._api_get('/columns', (response) => {
                this._data['status'] = response;
                callback(response);
            });
    },
    addColumn: function (boardId, title, callback) {
        this._api_post('/columns', {title, boardId}, (response) => {
            this._data['column_id'] = response;
            callback(response);
        })
    },
    renameColumn: function (title, boardId, statusId, callback, errorCallback) {
        this._api_put('/rename-column', {title, boardId, statusId}, (response) => {
            this._data['updated_column_id'] = response;
            callback(response);
        }, (error) => errorCallback(error))
    },
    getCards: function (callback) {
        this._api_get('/cards', (response) => {
                this._data['title'] = response;
                callback(response);
            });
    },
    addCard: function(boardId, title, statusId, callback) {
        this._api_post('/add-card', {title: title, board_id: boardId, status_id: statusId}, (response) => {
            this._data['card_position'] = response;
            callback(response);
        });
    },
    renameCard: function(cardId, title, callback) {
        this._api_put('/rename-card', {card_id: cardId, title: title}, (response) => {
            this._data['card_id'] = response;
            callback(response);
        })
    },
    updateCard: function (cardId, position, columnId) {
        this._api_put('/update-card', {card_id: cardId, position: position, columnId: columnId}, (response) => {
            return response;
        })
    },
    deleteColumn: function (statusId, boardId, callback) {
        this._api_delete('/delete-column', {status_id: statusId, board_id: boardId}, (response) => {
            this._data['column_id'] = response;
            callback(response);
        })
    },
    deleteCard: function (cardId, callback) {
        this._api_delete('/delete-card', {card_id: cardId}, (response) => {
            this._data['card_id'] = response;
            callback(response);
        })
    }
};


