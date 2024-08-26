let routines = []
const steps = []
let draggedItem
const baseURL = window.location.origin
const draggableStepsListEl = document.getElementById("draggable-steps-list")
const addStepInputEl = document.getElementById("add-step-input")
const titleInputEl = document.getElementById("title-input")

function addStep(){
    const stepText = addStepInputEl.value
    if(!stepText){
        window.alert("Please enter text for the step.")
        return
    }
    draggableStepsListEl.innerHTML += `
        <li draggable="true" oncontextmenu="this.remove()">
            ${stepText} <img src="/static/grip-vertical.svg">
        </li>
    `
    addStepInputEl.value = ""
}

addStepInputEl.addEventListener('keyup', (e) => {
    if(e.key == 'Enter'){
        addStep()
    }
})

function cancelRoutine(){
    if (window.confirm("Are you sure you want to exit? Your changes will be lost.")){
        window.location.href = baseURL + `/app`
    }
}

function saveRoutine(){
    //Check title
    let title = titleInputEl.value
    if(!titleInputEl.value){
        window.alert("Please add a routine title.")
        return
    }
    //Generate Steps
    let stepsCollectEl = draggableStepsListEl.children
    for(let i = 0; i < stepsCollectEl.length; i++){
        let stepText = stepsCollectEl.item(i).innerText
        steps.push({Name : stepText.trim(), Completed : false})
    }
    console.log(steps)
    //Generate routine object and add to routine data
    let newRoutine = {Name : title, Steps : steps}
    routines.push(newRoutine)
    //Send request and handle response
    console.log(routines)
    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(routines)
    }
    fetch(`${baseURL}/data`, options)
        .then(resp => resp.json())
        .then(rawData => {
            if(rawData["Database updated?"]){
                window.alert("Routine Created Successfully")
                window.location.href = baseURL + `/app`
            }
            else{
                window.alert("Error Occured: Routine not Updated")
            }
        })
}

const getDragAfterElement = (container, y) => {
    const draggableElements = [
        ...container.querySelectorAll(
            "li:not(.dragging)"
        ),];
 
    return draggableElements.reduce(
        (closest, child) => {
            const box =
                child.getBoundingClientRect();
            const offset =
                y - box.top - box.height / 2;
            if (
                offset < 0 &&
                offset > closest.offset) {
                return {
                    offset: offset,
                    element: child,
                };} 
            else {
                return closest;
            }
        },
        {
            offset: Number.NEGATIVE_INFINITY,
        }
    ).element;
};

draggableStepsListEl.addEventListener('dragstart', (e) => {
    //Store reference to dragged object and hide the object
    draggedItem = e.target
    setTimeout(() => {
        e.target.style.display =
            "none";
    }, 0);
})

draggableStepsListEl.addEventListener('dragend', e => {
    setTimeout(() => {
        e.target.style.display = "";
        draggedItem = null;
    }, 0);
})

draggableStepsListEl.addEventListener('dragover', e => {
    e.preventDefault()
    const afterElement = getDragAfterElement( draggableStepsListEl, e.clientY)
    if (afterElement == null) {
        draggableStepsListEl.appendChild(
            draggedItem
        );} 
    else {
        draggableStepsListEl.insertBefore(
            draggedItem,
            afterElement
        );}
})

console.log(baseURL)
fetch(`${baseURL}/data`)
    .then(resp => resp.json())
    .then(rawData => {
        routines = rawData.Routines
    })