const pageH1 = document.getElementById("page-h1")
const runningStepsFormEl = document.getElementById("running-steps-form")
const cancelBtnEl = document.getElementById("cancel-btn")
const saveBtnEl = document.getElementById("save-btn")
const baseURL = window.location.origin
const pathname = window.location.pathname
const routineID = Number(pathname.substring(pathname.lastIndexOf('/') + 1))
let routines = []
let steps = []

function setupSteps(){
    console.log(steps)
    let formHTML = "<fieldset>"
    for(let i = 0; i<steps.length; i++){
        let step = steps[i]
        formHTML +=
        `
        <div class="running-step">
                            <label for="running-step-${i}">${step.Name}</label>
                            <input id="running-step-${i}" type="checkbox"`
        if(step.Completed){
            formHTML += " checked"
        }
        formHTML += 
        `                    >
                        </div>
        `
    }
    formHTML += `</fieldset>`
    runningStepsFormEl.innerHTML = formHTML
}

function updateSteps(){
    //Update steps array with step data to save to main data
    for(let i = 0; i<steps.length; i++){
        let stepEl = document.getElementById(`running-step-${i}`)
        steps[i].Completed = stepEl.checked
    }
}

function generateJSON(){
    //Generate JSON of all routine data
    routines[routineID].Steps = steps
    return JSON.stringify({"Routines" : routines})
}

cancelBtnEl.addEventListener('click', () => {
    window.location.href = baseURL + `/app`
})

saveBtnEl.addEventListener('click', () => {
    console.log("save routine")
    updateSteps()
    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: generateJSON()
    }
    console.log("Incomplete. Please update server to take incoming data.")
    console.log("Data to send: " + generateJSON())
    fetch(`${baseURL}/data`, options)
        .then(resp => resp.json())
        .then(rawData => {
            if(rawData["Database updated?"]){
                window.alert("Routine Updated Successfully")
                window.location.href = baseURL + `/app`
            }
            else{
                window.alert("Error Occured: Routine not Updated")
            }
        })
})

function clearForm(){
    console.log("Clearing all inputs")
    const inputs = runningStepsFormEl.getElementsByTagName('input')
    console.log(inputs)
    for(let i = 0; i < inputs.length; i++){
        inputs[i].checked = false
    }
}

fetch(`${baseURL}/data`)
    .then(resp => resp.json())
    .then(rawData => {
        routines = rawData.Routines
        let routine = routines[routineID]
        pageH1.innerText = "Routine " + routineID + ": " + routine.Name
        steps = routine.Steps
        setupSteps()
    })

