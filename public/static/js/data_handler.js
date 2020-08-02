// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())  // parse the response as JSON
        .then(json_response => callback(json_response));  // Call the `callback` with the returned object
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
    init: function () {
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards
        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/boards', (response) => {
            this._data['boards'] = response;
            callback(response);
        });
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
        this._api_get('/columns', (response) => {
                this._data['status'] = response;
                callback(response);
            });
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCards: function (callback) {
        // the cards are retrieved and then the callback function is called with the cards
        this._api_get('/cards', (response) => {
                this._data['title'] = response;
                callback(response);
            });
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (boardTitle, callback) {
        this._api_post('/create-new-board', boardTitle, (response) => {
            this._data['latest_board_id'] = response;
            callback(response);
        })
    },
    renameBoard: function (title, boardId, callback) {
        this._api_put('/rename-board', {title: title, board_id: boardId}, (response) => {
            this._data['updated_board_id'] = response;
            callback(response);
        })
    },
    changeBoardVisibility: function (boardId) {
        this._api_put('/change-board-visibility', boardId, (response) => {
            this._data['updated_board_id'] = response;
        })
    },
    addColumn: function (boardId, title, callback, errorCallback) {
        this._api_post('/add-column', {title: title, board_id: boardId}, (response) => {
            this._data['column_id'] = response;
            callback(response);
        }, (error) => errorCallback(error))
    },
    renameColumn: function (title, boardId, statusId, callback, errorCallback) {
        this._api_put('/rename-column', {title: title, board_id: boardId, status_id: statusId}, (response) => {
            this._data['updated_column_id'] = response;
            callback(response);
        }, (error) => errorCallback(error))
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
            // this._data['card_id'] = response;
            return response;
        })
    },
    deleteBoard: function (boardId, callback) {
        this._api_delete('/delete-board', {board_id: boardId}, (response) => {
            this._data['board_id'] = response;
            callback(response);
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


