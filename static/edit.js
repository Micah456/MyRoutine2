let routines = []
let steps = []
let draggedItem
const baseURL = window.location.origin
const draggableStepsListEl = document.getElementById("draggable-steps-list")
const addStepInputEl = document.getElementById("add-step-input")
const titleInputEl = document.getElementById("title-input")

function getRoutineID(){
    const pathname = window.location.pathname
    let endIndex = pathname.lastIndexOf('/')
    let routinePath = pathname.substring(0, endIndex)
    let startIndex = routinePath.lastIndexOf('/') + 1
    let id = routinePath.substring(startIndex)
    console.log(id)
    return Number(id)
}

function setupSteps(){
    for(let i = 0; i < steps.length; i++){
        const stepText = steps[i].Name
        draggableStepsListEl.innerHTML += `
            <li draggable="true" oncontextmenu="this.remove()">
                ${stepText} <img src="/static/grip-vertical.svg">
            </li>
        `
    }
}

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

function returnToRoutinePage(){
    const currentHref = window.location.href
    const endIndex = currentHref.lastIndexOf('/')
    window.location.href = currentHref.substring(0, endIndex)
}

function cancelRoutine(){
    if (window.confirm("Are you sure you want to exit? Your changes will be lost.")){
        returnToRoutinePage()
    }
}

function deleteRoutine(){
    if(window.confirm("Are you sure you want to delete this routine? You cannot undo this.")){
        //console.log("Old data: " + JSON.stringify(routines))
        routines.splice(getRoutineID(), 1)
        //console.log("New data: " + JSON.stringify(routines))
        updateDatabase(() => {
            window.location.href = baseURL + `/app`
        }, "Routine Deleted Successfully")
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
    if(stepsCollectEl.length == 0){
        window.alert("Your routine must have at least one step. ")
        return
    }
    steps = []
    for(let i = 0; i < stepsCollectEl.length; i++){
        let stepText = stepsCollectEl.item(i).innerText
        steps.push({Name : stepText.trim(), Completed : false})
    }
    console.log(steps)
    //Generate routine object and add to routine data
    let newRoutine = {Name : title, Steps : steps}
    //console.log("Old data: " + JSON.stringify(routines))
    routines[getRoutineID()] = newRoutine
    //console.log("New data: " + JSON.stringify(routines))
    updateDatabase(returnToRoutinePage, "Routine Updated Successfully")
}

function updateDatabase(nextFunction, successMessage){
     //Send request and handle response
     const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({Routines : routines})
    }
    fetch(`${baseURL}/data`, options)
        .then(resp => resp.json())
        .then(rawData => {
            if(rawData["Database updated?"]){
                window.alert(successMessage)
                nextFunction()
            }
            else{
                window.alert("Error Occured")
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



fetch(`${baseURL}/data`)
    .then(resp => resp.json())
    .then(rawData => {
        routines = rawData.Routines
        let routine = routines[getRoutineID()]
        titleInputEl.value = routine.Name
        steps = routine.Steps
        setupSteps()
    })