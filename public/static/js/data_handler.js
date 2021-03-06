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
    renameColumn: function (title, boardId, columnId, callback, errorCallback) {
        this._api_put('/columns', {title, boardId, columnId}, (response) => {
            this._data['renamed_column_id'] = response;
            callback(response);
        }, (error) => errorCallback(error))
    },
    deleteColumn: function (columnId, boardId, callback) {
        this._api_delete('/columns', {columnId, boardId}, (response) => {
            this._data['deleted_column_id'] = response;
            callback(response);
        })
    },
    getCards: function (callback) {
        this._api_get('/cards', (response) => {
                this._data['title'] = response;
                callback(response);
            });
    },
    addCard: function(boardId, title, columnId, callback) {
        this._api_post('/cards', {title, boardId, columnId}, (response) => {
            this._data['new_card_position'] = response;
            callback(response);
        });
    },
    renameCard: function(cardId, title, callback) {
        this._api_put('/cards', {cardId, title}, (response) => {
            this._data['renamed_card_id'] = response;
            callback(response);
        })
    },
    deleteCard: function (cardId, callback) {
        this._api_delete('/cards', {cardId}, (response) => {
            this._data['deleted_card_id'] = response;
            callback(response);
        })
    },
    repositionCard: function (cardId, position, columnId) {
        this._api_put('/cards/position', {cardId, position, columnId}, (response) => {
            return response;
        })
    },
};


