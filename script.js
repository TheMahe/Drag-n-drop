const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogListEl = document.getElementById('backlog-list');
const progressListEl = document.getElementById('progress-list');
const completeListEl = document.getElementById('complete-list');
const onHoldListEl = document.getElementById('on-hold-list');

let updatedOnLoad = false;
let listArrays = [];

function getSavedColumns() {
  const backlogItems = localStorage.getItem('backlogItems');
  const progressItems = localStorage.getItem('progressItems');
  const completeItems = localStorage.getItem('completeItems');
  const onHoldItems = localStorage.getItem('onHoldItems');

  backlogListArray = backlogItems ? JSON.parse(backlogItems) : ['Release the course', 'Sit back and relax'];
  progressListArray = progressItems ? JSON.parse(progressItems) : ['Work on projects', 'Listen to music'];
  completeListArray = completeItems ? JSON.parse(completeItems) : ['Being cool', 'Getting stuff done'];
  onHoldListArray = onHoldItems ? JSON.parse(onHoldItems) : ['Being uncool'];
}

function updateSavedColumns() {
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

function filterArray(array) {
  return array.filter(item => item !== null);
}

function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement('li');
  listEl.textContent = item;
  listEl.id = index;
  listEl.classList.add('drag-item');
  listEl.draggable = true;
  listEl.addEventListener('focusout', () => updateItem(index, column));
  listEl.addEventListener('dragstart', drag);
  listEl.contentEditable = true;
  columnEl.appendChild(listEl);
}

function updateDOM() {
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  backlogListEl.textContent = '';
  backlogListArray.map((backlogItem, index) => createItemEl(backlogListEl, 0, backlogItem, index));
  backlogListArray = filterArray(backlogListArray);

  progressListEl.textContent = '';
  progressListArray.map((progressItem, index) => createItemEl(progressListEl, 1, progressItem, index));
  progressListArray = filterArray(progressListArray);

  completeListEl.textContent = '';
  completeListArray.map((completeItem, index) => createItemEl(completeListEl, 2, completeItem, index));
  completeListArray = filterArray(completeListArray);

  onHoldListEl.textContent = '';
  onHoldListArray.map((onHoldItem, index) => createItemEl(onHoldListEl, 3, onHoldItem, index));
  onHoldListArray = filterArray(onHoldListArray);

  updatedOnLoad = true;
  updateSavedColumns();
}

function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumn = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumn[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumn[id].textContent;
    }
    updateDOM();
  }
}

function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM(column);
}

function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

function rebuildArrays() {
  backlogListArray = Array.from(backlogListEl.children).map(child => child.textContent);
  progressListArray = Array.from(progressListEl.children).map(child => child.textContent);
  completeListArray = Array.from(completeListEl.children).map(child => child.textContent);
  onHoldListArray = Array.from(onHoldListEl.children).map(child => child.textContent);
  updateDOM();
}

function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const parent = listColumns[currentColumn];
  listColumns.forEach(column => column.classList.remove('over'));
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
}

updateDOM();