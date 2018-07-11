// Todo List

//Data
var todoList = {
  todos: [],
  createStorage: function(){
    localStorage.setItem("todoArray", JSON.stringify(todoList.todos));
  },
  getTodos: function(){
    var todoStorage = JSON.parse(localStorage.getItem("todoArray"));  
    todoArr = todoStorage;
    return todoArr;
  },
  setTodos: function(todoArr){
    localStorage.setItem("todoArray",JSON.stringify(todoArr));
  },
  addTodo: function(todoText){
    this.getTodos();
    todoArr.push({
      todoText: todoText,
      completed: false
    });
    this.setTodos(todoArr);
  }, 
  changeTodo: function(position, todoText){
    this.getTodos();
    todoArr[position].todoText = todoText;
    this.setTodos(todoArr);
  },
  deleteTodo: function(position){
    this.getTodos();
    todoArr.splice(position, 1);
    this.setTodos(todoArr);
  },  
  toggleCompleted: function(position){
    this.getTodos();
    var todo = todoArr[position];
    todo.completed = !todo.completed;
    this.setTodos(todoArr);
  },
  toggleAll: function(){
    this.getTodos();
    var totalTodos = todoArr.length;
    var completedTodos = 0;  

    //Get number of completed todos
    todoArr.forEach(function(todo){
      if(todo.completed === true){
        completedTodos++;
      }
    });
    todoArr.forEach(function(todo){
      // Case 1: If everything's true, make everything false
      if(completedTodos === totalTodos){
        todo.completed = false;
      } else {
        // Case 2: Otherwise, make everything true
        todo.completed = true;
      }
    });
    this.setTodos(todoArr);
    }
  };

  
var view = {
  displayTodos: function(){ //render
    var todosUl = document.querySelector("ul");
    todosUl.innerHTML = "";
    var toggleIcon = "<i class='fa fa-circle-o fa-lg'></i>";
    var completedIcon = "<i class='fa fa-check-circle-o fa-lg'></i>";

    todoList.getTodos();
    if (todoArr == undefined || null){
      todoList.createStorage();
    }
    todoArr.forEach(function(todo, position){
      var todoLi = document.createElement("li");
      var todoTextWithCompletion = "";

      if(todo.completed === true){
        todoTextWithCompletion = completedIcon + todo.todoText;
        todoLi.classList.toggle("completed");
      } else {
        todoTextWithCompletion = toggleIcon + todo.todoText;
      }

      todoLi.id = position;
      todoLi.innerHTML = todoTextWithCompletion;
      todoLi.appendChild(this.createDeleteIcon());
      todosUl.appendChild(todoLi);
    }, this);

    todoList.setTodos(todoArr);
  },
  createDeleteIcon: function(){
    var deleteIcon = document.createElement("i");
    deleteIcon.id = "delete";
    deleteIcon.className = "fa fa-times fa-lg";
    return deleteIcon;
  },
  addTodo: function(value){
    var todosUl = document.querySelector("ul");
    var toggleIcon = "<i class='fa fa-circle-o fa-lg'></i>";
    var todoLi = document.createElement("li");
    var todoTextWithCompletion = "";
    todoTextWithCompletion = toggleIcon + value;
    todoLi.innerHTML = todoTextWithCompletion;
    todoLi.appendChild(this.createDeleteIcon());
    todosUl.appendChild(todoLi);
  },
  changeTextToEdit: function(todoText){
    var input = document.createElement("input");
    input.value = todoText.textContent;
    input.maxLength = "22";
    todoText.parentNode.replaceChild(input,todoText);
    input.id = "input";
    input.focus();
    return input;
  },
  changeEditToText: function(todoText, input){
    input.parentNode.replaceChild(todoText, input); 
  },
  getInput: function(){
    var addTodoTextInput = document.getElementById("addTodoTextInput").value; 
    return addTodoTextInput;
  },
  deleteTodo: function(todo){
    todo.remove();
  },
  toggleCompleted: function(todo, completed, uncompleted){
    icon = document.createElement("i");
    if(!(todo.className === "completed")){
      icon.className = completed;
      todo.replaceChild(icon, todo.childNodes[0]);
      todo.classList.toggle("completed");
    } else{
      icon.className = uncompleted;
      todo.replaceChild(icon, todo.childNodes[0]);
      todo.classList.toggle("completed");
    }
  },
  toggleAll: function(listItems, completed, uncompleted){
    listItems.forEach(function(todo){
      icon = document.createElement("i");
      if(!(todo.className === "completed")){
        icon.className = completed;
        todo.replaceChild(icon, todo.childNodes[0]);
        todo.classList.toggle("completed");
      } else{
        icon.className = uncompleted;
        todo.replaceChild(icon, todo.childNodes[0]);
        todo.classList.toggle("completed");
      }
    });
  }
};

var controller = {
  setEventListeners: function(){
    var todosUl = document.querySelector("ul");
    var addTodo = document.querySelector("#addTodoTextInput");
    var checked = "fa fa-check-circle-o fa-lg";
    var unchecked = "fa fa-circle-o fa-lg";

    todosUl.addEventListener("click", function(event){
      controller.deleteTodo(event);
      controller.toggleCompleted(event);
    });
          
    todosUl.addEventListener("dblclick", this.editTodo);

    addTodo.addEventListener("keydown", function(event){
      if(event.which === 13){
        controller.addTodo(event);
      }
    });
  },
  addTodo: function(event){
    var input = view.getInput();
    todoList.addTodo(input);
    addTodoTextInput.value = '';
    view.addTodo(input);   
    //view.displayTodos();
  },
  editTodo: function(event){  
    var elementClicked = event.target;
    var todoText = elementClicked.childNodes[1];
    if (todoText) {
      var input = view.changeTextToEdit(todoText);       
      input.addEventListener("keydown", function(event){
        var todoIndex = elementClicked.id;

        if (event.which === 13 || event.keyCode === 13){
          todoText.textContent = input.value;
          this.blur();
          todoList.changeTodo(parseInt(todoIndex),input.value);//data change
        } else if (event.which === 27 || event.keyCode === 27){
          this.blur();
        }
      }); 
      input.addEventListener("blur", function(event){
        view.changeEditToText(todoText, input);
      })
    }

  },
  deleteTodo: function(event){
    var elementClicked = event.target;
    var todoIndex = elementClicked.parentNode.id;
    
    if(elementClicked.id === "delete"){
      todoList.deleteTodo(todoIndex);
      view.deleteTodo(elementClicked.parentNode);
    }
  },
  toggleCompleted: function(todoIndex){
    var checked = "fa fa-check-circle-o fa-lg";
    var unchecked = "fa fa-circle-o fa-lg";
    var elementClicked = event.target;
    var todoIndex = elementClicked.parentNode.id;
    if(elementClicked.className === unchecked
      || elementClicked.className === checked){
        todoList.toggleCompleted(parseInt(todoIndex));
        view.toggleCompleted(elementClicked.parentNode, checked, unchecked);
    }
  },
  toggleAll: function(){
    var checked = "fa fa-check-circle-o fa-lg";
    var unchecked = "fa fa-circle-o fa-lg";
    todoList.toggleAll();
    var todosUl = document.querySelector("ul");
    view.toggleAll(todosUl.childNodes, checked, unchecked);
  },
  init: function(){
    controller.setEventListeners();

    view.displayTodos();
  }
};

controller.init();
