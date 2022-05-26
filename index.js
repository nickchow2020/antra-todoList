const display_data_list = document.getElementById("task_list");
const add_task_form = document.querySelector("[data-add-list-form]");
const add_task_input = document.querySelector("[data-add-list-input]");
const delete_task_btn = document.querySelector("[data-delete-task]");

const LOCAL_STORAGE_LIST_KEY = "task.list";
const LOCAL_STORAGE_LIST_ID_KEY = "task.list.id";

let myList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];

let selectedListId = localStorage.getItem(LOCAL_STORAGE_LIST_ID_KEY)

let data_API = [];


display_data_list.addEventListener("click", e =>{
  if(e.target.tagName.toLowerCase() === "li"){
    selectedListId = e.target.id
    save()
    render()
  }
})

add_task_form.addEventListener("submit", (e) =>{

  e.preventDefault()

  const input_value = add_task_input.value

  if(input_value === null || input_value === "") return 

  const data = {
    id: +Date.now().toString(),
    title: input_value,
    completed: false,
    task:[]
  }

  add_task_input.value = ""
  data_API.push(data)
  myList.push(data)
  save()
  renderList(data)
})


delete_task_btn.addEventListener("click", e => {
  const newData = data_API.filter(data => data.id !== +selectedListId)

  myList = myList.filter(data => data.id !== +selectedListId)

  data_API = [...new Set([...newData,...myList])]
  
  selectedListId = null

  save()
  render()
})


function render(){
  clearElements(display_data_list)

  data_API.forEach(data => {
    renderList(data)
  })
}

function renderList(data){
    const taskList = document.createElement("li")
    taskList.innerText = data.title
    taskList.setAttribute("id",data.id)
    if(taskList.id === selectedListId){
      taskList.classList.add("active")
    }

    display_data_list.appendChild(taskList) 
}

function save(){
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(myList))
  localStorage.setItem(LOCAL_STORAGE_LIST_ID_KEY, selectedListId)
}


function clearElements(element){
  while(element.firstChild){
    element.removeChild(element.firstChild)
  }
}

async function getJSON(url){
  try{
      const employeeList = await fetch(url);
      const employeeListJson = await employeeList.json();
      return employeeListJson;
  }catch(err){
      throw err
  }
}




getJSON("https://jsonplaceholder.typicode.com/todos")
.then(data => {
  clearElements(display_data_list)
  const addTask = data.map(data => {
    return {
      ...data,
      task:[]
    }
  })

  data_API = [...addTask,...myList]
  
  data_API.forEach(data => renderList(data))
})

