// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";
import {} from './dragula.js';

export let dom = {
    init: function () {

    },
    loadBoards: function () {
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards)
            dataHandler.getColumns(function (columns) {
                dom.showColumns(columns);
                dataHandler.getCards(function (cards) {
                    dom.showCards(cards);
                    eventToAddBoard();
                    initDraggable();
                    eventToEditBoard();
                    eventToOpenClose();
                    eventToAddColumn();
                    eventToRenameColumns();
                    eventToAddCards();
                    eventToEditCard();
                    eventToDeleteBoard();
                    eventToDeleteColumn();
                    eventToDeleteCard();
                })
            });
        });
    },
    showBoards: function (boards) {
        let boardList = `<button class="board-add" id="add-board">Add Board</button>`;
        for (let board of boards) {
            boardList += `
                <section class="board" id="section-${board.id}">
                    <div class="board-header">
                        <span class="board-title">${board.title}</span>
                        <button class="board-add ${board.is_active === false ? 'inactive' : ''}">Add Card</button>
                        <button class="column-add ${board.is_active === false ? 'inactive' : ''}">Add Column</button>
                        <button class="board-toggle"><i class="fas fa-chevron-${board.is_active === true ? 'up' : 'down'}"></i></button>
                        <button class="board-delete"><i class="fas fa-trash-alt"></i></button>
                    </div>
                    <div class="board-columns" id="board-${board.id}"></div>
                </section>
            `;
        }
        const outerHtml = `
            <div class="board-container">
                ${boardList}
            </div>
        `;
        let boardsContainer = document.querySelector('#boards');
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
    },
    showColumns: function (columns) {
        for (let column of columns) {
            let boardColumns = document.querySelector(`#board-${column.board_id}`);
            let newColumn = document.createElement('div');
            newColumn.classList.add('board-column');
            newColumn.innerHTML +=
                `
                    <div class="board-column-title">${column.name}</div>
                    <i class="fa fa-times-circle column-delete" aria-hidden="true"></i>
                    <div class="board-column-content" id="column-${column.board_id}-${column.id}"></div>
                `;
            if (!column.active) {
                boardColumns.classList.add('inactive');
            }
            boardColumns.appendChild(newColumn);
        }
    },
    showCards: function (cards) {
        for (let card of cards) {
            let container = document.querySelector(`#column-${card.board_id}-${card.status_id}`);
            container.innerHTML +=
                `<div class="card" id="card-${card.id}" data-position="${card.position}">
                    <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                    <div class="card-title">${card.title}</div>
                </div>`
        }
        document.querySelector('#loading').remove();
    },
};

function eventToOpenClose() {
    let openCloseButtons = document.querySelectorAll('.board-toggle');
    for (let button of openCloseButtons) {
        button.addEventListener('click', openCloseBoard);
    }
}

function eventToAddBoard() {
    let addBoard = document.getElementById('add-board');
    addBoard.addEventListener('click', loadNewBoard);
}

function eventToAddColumn() {
    let addColumns = document.querySelectorAll('.column-add');
    for (let column of addColumns) {
        column.addEventListener('click', loadNewColumn);
    }
}

function eventToEditBoard() {
    let boardTitles = document.querySelectorAll('.board-title');
    for (let boardTitle of boardTitles) {
        boardTitle.addEventListener('dblclick', editTitle);
    }
}

function eventToAddCards() {
    let addCardButtons = document.querySelectorAll('.board-header .board-add');
    for (let button of addCardButtons) {
        button.addEventListener('click', addNewCard)
    }
}

function addNewCard() {
    let boardColumns = this.closest('section').querySelector('.board-columns');
    let firstColumn = boardColumns.firstElementChild.querySelector('.board-column-content');

    let newCard = `<div class="card">
                        <div class="card-remove"></div>
                        <div class="card-title">
                            <input id="new-card-input" class="narrow" type="text" autocomplete="off">
                        </div>
                    </div>`
    firstColumn.insertAdjacentHTML("beforeend", newCard);
    let inputField = document.querySelector('#new-card-input');
    removeAllEventListeners();
    inputField.addEventListener('keyup', saveCardTitle);
    setTimeout(function () {
        window.addEventListener('click', closeNewInputField)
    }, 200);
}

function saveCardTitle(event) {
    if (event.keyCode === 13 && this.value) {
        let title = this.value;
        let boardId = this.closest('section').id.split('-')[1];
        let columnId = this.closest('.board-column-content').id.split('-')[2];
        dataHandler.addCard(boardId, title, columnId, (response) => displayNewCard(response));
    } else if (event.keyCode === 13) {
        this.closest('.card').remove();
        addAllEventListeners();
    }
}

function closeNewInputField(event) {
    let inputField = document.querySelector('#new-card-input');
    if (event.target !== inputField) {
        inputField.closest('.card').remove();
        addAllEventListeners();
        window.removeEventListener('click', closeNewInputField)
    }
}

function closeEditedInputField(event) {
    let inputField = document.querySelector('#edited-card-title');
    if (event.target !== inputField) {
        inputField.closest('.card-title').innerHTML = localStorage.getItem('edited-card-title');
        addAllEventListeners();
        window.removeEventListener('click', closeEditedInputField)
    }
}


function displayNewCard(response) {
    let newTitle = document.querySelector('#new-card-input').value;
    let cardContainer = document.querySelector('#new-card-input').closest('.card')
    cardContainer.querySelector('.card-remove').innerHTML = `<i class="fas fa-trash-alt"></i>`;
    cardContainer.querySelector('.card-title').innerHTML = newTitle;
    cardContainer.dataset.position = response.order_by_position;
    cardContainer.id = `card-${response.id}`;
    window.removeEventListener('click', closeNewInputField)
    addAllEventListeners();
}

function loadNewBoard() {
    let boardsContainer = document.querySelector('.board-container');
    removeAllEventListeners();
    let newBoard = `
            <section class="board" id="latestBoardSection">
                <div class="board-header">
                    <span class="board-title">
                        <input type="text" id="new-board-title" autocomplete="off">
                        <button class="board-add" id="save-new-board">Save</button>
                    </span>
                    <button class="board-toggle"><i class="fas fa-chevron-up"></i></button>
                    <button class="board-delete"><i class="fas fa-trash-alt"></i></button>
                </div>
                <div class="board-columns" id="latestBoard">
                    <div class="board-column">
                        <div class="board-column-title">Main Stage</div>
                        <i class="fa fa-times-circle column-delete" aria-hidden="true"></i>
                        <div class="board-column-content"></div>
                    </div>
                    <div class="board-column">
                        <div class="board-column-title">Techno Tent</div>
                        <i class="fa fa-times-circle column-delete" aria-hidden="true"></i>
                        <div class="board-column-content"></div>
                    </div>
                    <div class="board-column">
                        <div class="board-column-title">Metal Stage</div>
                        <i class="fa fa-times-circle column-delete" aria-hidden="true"></i>
                        <div class="board-column-content"></div>
                    </div>
                    <div class="board-column">
                        <div class="board-column-title">Retro Stage</div>
                        <i class="fa fa-times-circle column-delete" aria-hidden="true"></i>
                        <div class="board-column-content"></div>
                    </div>
                </div>
            </section>
        `;
    boardsContainer.insertAdjacentHTML("beforeend", newBoard);
    let saveButton = document.getElementById('save-new-board');
    saveButton.addEventListener('click', saveNewBoard)
    eventToOpenClose();
}

function loadNewColumn() {
    removeAllEventListeners();
    let boardId = this.closest("section").id.split('-')[1];
    let boardColumns = document.querySelector(`#board-${boardId}`);
    let newColumn = document.createElement('div');
    newColumn.classList.add('board-column');
    newColumn.innerHTML +=
        `<div class="new-board-column">
            <input type="text" id="new-column-title" size="9" autocomplete="off">
            <button class="column-add" id="save-new-column">Save</button>
            <div class="board-column-content"></div>
        </div>`;
    boardColumns.appendChild(newColumn);
    let saveButton = document.getElementById('save-new-column');
    saveButton.addEventListener('click', saveNewColumn)
}

function saveNewBoard() {
    let newTitle = document.getElementById('new-board-title').value;
    if (newTitle) {
        dataHandler.createNewBoard(newTitle, (id) => displayNewTitle(id));
    }
}

function saveNewColumn() {
    let boardId = this.closest("section").id.split('-')[1];
    let columnTitle = document.getElementById('new-column-title').value;
    if (columnTitle) {
        dataHandler.addColumn(boardId, columnTitle, id => displayNewColumn(id));
    }
}

function saveEditedBoard() {
    let editedTitle = document.querySelector('#edited-board-title').value;
    let boardId = this.closest("section").id.split('-')[1];
    if (editedTitle) {
        dataHandler.renameBoard(editedTitle, boardId, boardId => displayEditedTitle(boardId));
    }
}

function displayNewTitle(id) {
    let newTitle = document.getElementById('new-board-title').value;
    let latestBoardId = document.getElementById('latestBoard');
    latestBoardId.id = `board-${id}`;
    let latestBoardSection = document.getElementById('latestBoardSection');
    latestBoardSection.id = `section-${id}`;
    latestBoardSection.querySelector('input').remove();
    latestBoardSection.querySelector('#save-new-board').remove();
    latestBoardSection.querySelector('span').innerHTML = newTitle;
    let columnStatuses = latestBoardSection.querySelectorAll('.board-column-content');
    for (let i = 0; i < 4; i++) {
        columnStatuses[i].id = `column-${id}-${i}`;
    }
    latestBoardSection.querySelector('span').insertAdjacentHTML("afterend", `<button class="board-add">Add Card</button> <button class="column-add">Add Column</button>`);
    addDraggableFeature(id);
    addAllEventListeners();
}

function displayNewColumn(id) {
    if (id !== 'error') {
        let columnTitle = document.getElementById('new-column-title').value;
        let boardId = document.getElementById('new-column-title').closest("section").id.split('-')[1];
        let boardColumns = document.querySelector(`#board-${boardId}`);
        let columnDiv = boardColumns.querySelector('.new-board-column');
        columnDiv.innerHTML =
            `<div class="board-column-title">${columnTitle}</div>
            <i class="fa fa-times-circle column-delete" aria-hidden="true"></i>
            <div class="board-column-content" id="column-${boardId}-${id}"></div>`
        columnDiv.classList.remove('new-board-column');
        columnDiv.classList.add('board-column');
        addAllEventListeners();
    } else {
        displayTakenColumnError('#new-column-title');
    }
}

function displayEditedTitle(boardId) {
    let editedTitle = document.querySelector('#edited-board-title').value;
    let boardSection = document.querySelector(`#section-${boardId}`);
    let boardSpan = boardSection.querySelector('span')
    boardSpan.innerHTML = editedTitle;
    addAllEventListeners();
}

function editTitle(event) {
    event.preventDefault();
    removeAllEventListeners();
    let currentTitle = this.innerHTML;
    this.innerHTML = `<input type="text" id="edited-board-title" value="${currentTitle}" autocomplete="off">\n<button class="board-add" id="save-edited-board">Save</button>`;
    let saveButton = document.getElementById('save-edited-board');
    saveButton.addEventListener('click', saveEditedBoard)
}

function openCloseBoard() {
    let section = this.closest("section")
    let boardButton = section.querySelector('.board-add')
    let columnButton = section.querySelector('.column-add')
    let columns = section.querySelector('.board-columns')
    let boardId = this.closest("section").id.split('-')[1];
    if (columns.classList.contains('inactive')) {
        columns.classList.remove('inactive')
        this.innerHTML = `<i class="fas fa-chevron-up"></i>`
        boardButton.classList.remove('inactive');
        columnButton.classList.remove('inactive');
    } else {
        columns.classList.add('inactive')
        this.innerHTML = `<i class="fas fa-chevron-down"></i>`
        boardButton.classList.add('inactive');
        columnButton.classList.add('inactive');
    }
    dataHandler.changeBoardVisibility(boardId)
}

function eventToRenameColumns() {
    let columnTitles = document.querySelectorAll('.board-column-title');
    for (let title of columnTitles) {
        title.addEventListener('dblclick', editColumnTitle)
    }
}

function editColumnTitle(event) {
    event.preventDefault();
    let deleteX = event.target.parentNode.querySelector('i');
    deleteX.classList.add('hide-content');
    let currentTitle = this.innerHTML;
    this.innerHTML = `<span class="column-edit-save"><input type="text" id="edited-column-title" value="${currentTitle}" autocomplete="off">
                        <button class="board-add" id="save-edited-column">Save</button></span>`;
    let saveButton = document.querySelector('#save-edited-column');
    removeAllEventListeners();
    saveButton.addEventListener('click', saveNewColumnName)
}

function saveNewColumnName(event) {
    event.preventDefault();
    let boardId = this.closest('section').id.split('-')[1];
    let columnId = this.closest('.board-column').querySelector('.board-column-content').id.split('-')[2];
    let newTitle = document.querySelector('#edited-column-title').value;
    if (newTitle) {
        dataHandler.renameColumn(newTitle, boardId, columnId, (result) => displayEditedColumn(result));
    }

}

function displayEditedColumn(result) {
    if (result !== 'error') {
        let board_id = result[0];
        let column_id = result[1];
        let editedTitle = document.querySelector('#edited-column-title');
        let newTitle = editedTitle.value;
        let titleContainer = editedTitle.closest('.board-column-title');
        let deleteX = titleContainer.parentNode.querySelector('i');
        deleteX.classList.remove('hide-content');
        titleContainer.innerHTML = newTitle;
        titleContainer.closest('.board-column').querySelector('.board-column-content').id = `column-${board_id}-${column_id}`;
        addAllEventListeners();
    } else{
        displayTakenColumnError('#edited-column-title');
    }
}

function displayTakenColumnError(selector) {
    let editedTitle = document.querySelector(selector);
    editedTitle.classList.add("error");
    setTimeout(function () {
        editedTitle.classList.remove("error");
    }, 900);
}

function eventToEditCard() {
    let cards = document.querySelectorAll('.card-title');
    for (let card of cards) {
        card.addEventListener('dblclick', editCardTitle)
    }
}

function editCardTitle(event) {
    event.preventDefault();
    removeAllEventListeners();
    let currentTitle = this.innerHTML;
    localStorage.setItem('edited-card-title', currentTitle);
    this.innerHTML = `<input type="text" class="narrow" id="edited-card-title" value="${currentTitle}" autocomplete="off">`;
    this.addEventListener('keyup', saveEditedCard);
    window.addEventListener('click', closeEditedInputField);
}

function saveEditedCard(event) {
    if (event.keyCode === 13) {
        let editedTitle = document.querySelector('#edited-card-title').value;
        let cardId = this.closest("div .card").id.split('-')[1];
        if (editedTitle) {
            dataHandler.renameCard(cardId, editedTitle, cardId => displayEditedCardTitle(cardId));
        }
        window.removeEventListener('click', closeEditedInputField)
    }
}

function displayEditedCardTitle(cardId) {
    let editedTitle = document.querySelector('#edited-card-title').value;
    let cardSection = document.querySelector(`#card-${cardId}`);
    let cardTitle = cardSection.querySelector('.card-title')
    cardTitle.innerHTML = editedTitle;
    addAllEventListeners();
}

function removeAllEventListeners() {
    let addBoard = document.getElementById('add-board');
    addBoard.removeEventListener('click', loadNewBoard);

    let addColumn = document.querySelectorAll('.column-add');
    for (let column of addColumn) {
        column.removeEventListener('click', loadNewColumn);
    }

    let boardTitles = document.querySelectorAll('.board-title');
    for (let boardTitle of boardTitles) {
        boardTitle.removeEventListener('dblclick', editTitle);
    }

    let columnTitles = document.querySelectorAll('.board-column-title');
    for (let title of columnTitles) {
        title.removeEventListener('dblclick', editColumnTitle)
    }

    let cardTitles = document.querySelectorAll('.card-title');
    for (let cardTitle of cardTitles) {
        cardTitle.removeEventListener('dblclick', editCardTitle)
    }

    let addCardButtons = document.querySelectorAll('.board-header .board-add');
    for (let button of addCardButtons) {
        button.removeEventListener('click', addNewCard)
    }

    const trashIcons = [...document.querySelectorAll('.board-delete')];
    trashIcons.forEach(icon => icon.removeEventListener('click', removeBoard));

    const xIcons = [...document.querySelectorAll('.column-delete')];
    xIcons.forEach(icon => icon.removeEventListener('click', removeColumn));

    const cardTrashIcons = [...document.querySelectorAll('.card-remove')];
    cardTrashIcons.forEach(icon => icon.addEventListener('click', removeCardProcedure));
}

function addAllEventListeners() {
    let addBoard = document.getElementById('add-board');
    addBoard.addEventListener('click', loadNewBoard);

    let addColumn = document.querySelectorAll('.column-add');
    for (let column of addColumn) {
        column.addEventListener('click', loadNewColumn);
    }

    let boardTitles = document.querySelectorAll('.board-title');
    for (let boardTitle of boardTitles) {
        boardTitle.addEventListener('dblclick', editTitle);
    }
    let columnTitles = document.querySelectorAll('.board-column-title');
    for (let title of columnTitles) {
        title.addEventListener('dblclick', editColumnTitle)
    }

    let cardTitles = document.querySelectorAll('.card-title');
    for (let cardTitle of cardTitles) {
        cardTitle.addEventListener('dblclick', editCardTitle)
    }

    let addCardButtons = document.querySelectorAll('.board-header .board-add');
    for (let button of addCardButtons) {
        button.addEventListener('click', addNewCard)
    }

    const trashIcons = [...document.querySelectorAll('.board-delete')];
    trashIcons.forEach(icon => icon.addEventListener('click', removeBoard));

    const xIcons = [...document.querySelectorAll('.column-delete')];
    xIcons.forEach(icon => icon.addEventListener('click', removeColumn));

    const cardTrashIcons = [...document.querySelectorAll('.card-remove')];
    cardTrashIcons.forEach(icon => icon.addEventListener('click', removeCardProcedure));
}

function initDraggable() {
    let boardIds = getBoardIds();
    for (let boardId of boardIds) {
        dragula({
            isContainer: function (el) {
                return el.classList.contains('board-column-content') && el.id.split('-')[1] === boardId.toString();
            }
        })
            .on('drop', refreshDatabasePositions)
    }
}

function addDraggableFeature(id) {
    dragula({
        isContainer: function (el) {
            return el.classList.contains('board-column-content') && el.id.split('-')[1] === id.toString();
        }
    })
        .on('drop', refreshDatabasePositions)
}

function getBoardIds() {
    let boards = [...document.querySelectorAll('.board')];
    let arrayIds = [];
    boards.forEach(board => arrayIds.push(parseInt(board.id.split('-')[1])))
    return arrayIds;
}

function refreshDatabasePositions(el, target, source) {
    refreshIndividualColumn(target);
    if (target !== source) {
        refreshIndividualColumn(source);
    }
}

function refreshIndividualColumn(column) {
    let rows = column.querySelectorAll('.card');
    let columnId = column.id.split('-')[2];
    let id;
    let arrayPromise = [];
    let counter = 0;
    for (let row of rows) {
        id = row.id.split('-')[1];
        arrayPromise.push(dataHandler.repositionCard(id, counter, columnId));
        counter++;
    }
    Promise.all(arrayPromise)
        .then((data) => refreshAttributePositions(column))
}

function refreshAttributePositions(column) {
    let rows = column.querySelectorAll('.card');
    let counter = 0;
    for (let row of rows) {
        row.dataset.position = counter.toString();
        counter++;
    }
}

function eventToDeleteBoard() {
    const trashIcons = [...document.querySelectorAll('.board-delete')];
    trashIcons.forEach(icon => icon.addEventListener('click', removeBoard));
}

function removeBoard() {
    let boardId = this.closest('section').id.split('-')[1];
    dataHandler.deleteBoard(boardId, removeBoardFromDOM);
}

function removeBoardFromDOM(boardId) {
    // let boardId = data.boardId;
    const sections = document.querySelectorAll('section');
    for (let section of sections) {
        if (section.id.split('-')[1] === boardId) {
            section.remove();
        }
    }
}

function eventToDeleteColumn() {
    const xIcons = [...document.querySelectorAll('.column-delete')];
    xIcons.forEach(icon => icon.addEventListener('click', removeColumn));
}

function removeColumn() {
    let boardId = this.closest('section').id.split('-')[1];
    let statusId = this.parentNode.querySelector('.board-column-content').id.split('-')[2];
    dataHandler.deleteColumn(statusId, boardId, removeColumnFromDOM);
}

function removeColumnFromDOM(data) {
    let boardId = data['boardId'];
    let columnId = data['columnId'];
    const sections = document.querySelectorAll('section');
    for (let section of sections) {
        if (section.id.split('-')[1] === boardId) {
            const columns = section.querySelectorAll('.board-column');
            for (let column of columns) {
                if (column.querySelector('.board-column-content').id.split('-')[2] === columnId) {
                    column.remove();
                }
            }
        }
    }
}

function eventToDeleteCard() {
    const trashIcons = [...document.querySelectorAll('.card-remove')];
    trashIcons.forEach(icon => icon.addEventListener('click', removeCardProcedure));
}

function removeCardProcedure() {
    const cardId = this.closest('.card').id.split('-')[1];
    dataHandler.deleteCard(cardId, removeCardFromDOM);
}

function removeCardFromDOM(cardId) {
    const cardToRemove = document.querySelector(`#card-${cardId}`);
    cardToRemove.remove();
}