const display_data_list = document.getElementById("task_list");
const add_task_form = document.querySelector("[data-add-list-form]");
const add_task_input = document.querySelector("[data-add-list-input]");
const delete_task_btn = document.querySelector("[data-delete-task]");
const detail_display_wrapper = document.querySelector("[data-detail-display]");
const detail_section = document.querySelector("[data-detail-section]")

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


  const target_data = data_API.find(data => data.id === +selectedListId)

  if(selectedListId){
    displayDetail(target_data)
    detail_section.style.display = ""
  }else{
    detail_section.style.display = "none"
  }

  console.log(target_data)
  
}

function displayDetail(data){

  clearElements(detail_display_wrapper)

  const header = document.createElement("div")
  const title = document.createElement("h3")
  const status = document.createElement("span")
  const checkbox_div = document.createElement("div")

  checkbox_div.classList.add("detail_checkbox")

  header.classList.add("detail_header")
  title.classList.add("detail_title")
  status.classList.add(data.completed ? "complete_status" : "in_complete_status")
  status.innerText =  data.completed ? "Completed" : "Incomplete";
  title.innerText = data.title
  header.appendChild(title)
  header.appendChild(status)
  detail_display_wrapper.appendChild(header)
  detail_display_wrapper.appendChild(checkbox_div)



  data.task.forEach( val  => {
    const detail_list_div = document.createElement("div")
    const label = document.createElement("label")
    label.setAttribute("for", `${data.id}`)

    label.classList.add(data.completed ? "complete" : null)

    detail_list_div.classList.add("detail_list")
    label.innerText = val;
    detail_list_div.appendChild(label)

    checkbox_div.appendChild(detail_list_div)
  })


  // const displayTemplate = 
  // `
  //     <div class="detail_header">
  //       <h3 class="detail_title">${data.title}</h3>
  //     </div>

  //     <div class="detail_checkbox">
  //       <div class="detail_list">
  //         <label for="detail_list_1" class="complete">
  //           <input type="checkbox" id="detail_list_1">
  //           Lorem ipsum dolor sit amet consectetur adipisicing.
  //         </label>
  //       </div>

  //       <div class="detail_list">
  //         <label for="detail_list_2">
  //           <input type="checkbox" id="detail_list_2">
  //           Lorem ipsum dolor sit amet consectetur adipisicing.
  //         </label>
  //       </div>

  //       <div class="detail_list">
  //         <label for="detail_list_3">
  //           <input type="checkbox" id="detail_list_3">
  //           Lorem ipsum dolor sit amet consectetur adipisicing.
  //         </label>
  //       </div>
  //     </div>

  //   <form action="" class="detail_add_form">
  //     <button class="detail_btn">+</button>
  //     <input type="text"
  //       placeholder="add new task detail"
  //       class="detail_input"
  //     >
  //   </form>
  // `

  // detail_display_wrapper.innerHTML = displayTemplate
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
      task:[data.title, `${data.title}Good`]
    }
  })

  data_API = [...addTask,...myList]
  
  data_API.forEach(data => renderList(data))
})

