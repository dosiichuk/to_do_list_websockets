const listWrapper = document.getElementById('list');
const taskInput = document.getElementById('taskInput');
const taskInputForm = document.getElementById('inputForm');
const loginnput = document.getElementById('loginInput');
const loginForm = document.getElementById('loginForm');
const userPlaceholder = document.getElementById('user');

let toDos = [];
let user;

//connect sockets
const socket = io();

socket.on('addTask', ({ user, task, id }) => {
  toDos.push({ user, task, id });
  addToDoItem(user, task, id);
});

socket.on('updateList', (list) => {
  toDos = [...list];
  renderToDoItems(toDos);
});

//login
const login = () => {
  if (!loginInput.value) {
    alert('Nickname cannot be empty');
    return;
  }
  user = loginInput.value;
  loginnput.blur();
  userPlaceholder.innerHTML = user;
  socket.emit('login', {
    user,
  });
};

//todo crud operations
const renderToDoItems = (list) => {
  listWrapper.innerHTML = '';
  list.forEach(({ user, task, id }) => {
    addToDoItem(user, task, id);
  });
};

const addToDoItem = (user, task, id) => {
  const html = `<div>
                    <span class="act">${task} (added by ${user})</span>
                    <button class="btn-delete" id=${id}>X</button>
                </div>
                `;
  listWrapper.insertAdjacentHTML('afterbegin', html);
  document.getElementById(id).addEventListener('click', removeToDoItem);
};

const removeToDoItem = (e) => {
  e.preventDefault();
  const id = e.target.getAttribute('id');
  toDos = toDos.filter((item) => item.id !== id);
  renderToDoItems(toDos);
  socket.emit('removeItem', id);
};

//Event listeners
taskInputForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const task = { user, task: taskInput.value, id: uuidv4() };
  addToDoItem(task.user, task.task, task.id);
  toDos.push(task);
  socket.emit('addTask', task);

  taskInput.value = '';
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  login();
  loginnput.value = '';
});

taskInput.addEventListener('focus', () => {
  if (!user) {
    alert('Please login (add nickname) before adding todos');
    taskInput.blur();
    return;
  }
});
