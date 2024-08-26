const baseURL = window.location.origin
const routineBtnsDivEl = document.getElementById("routine-btns-div")
const createRoutineBtnEl = document.getElementById("create-routine-btn")
const backupBtnEl = document.getElementById("backup-btn")
createRoutineBtnEl.addEventListener('click', () => {
    window.location.href += "/routine/create"
})
backupBtnEl.addEventListener('click', () => {
    fetch(`${baseURL}/data/update_backup`)
    .then(resp => resp.json())
    .then(rawData => {
        window.alert(rawData.Message)
        if(rawData["Error Message"]){
            console.log("Error : " + rawData["Error Message"])
        }
    })
})
let routines = []

function setUpRoutines(){
    let routineBtnsHTML = ""
    for(let i = 0; i<routines.length; i++){
        routineBtnsHTML += `<button class="routine-btn" onclick="clickRoutine(${i})">${routines[i].Name}</button>`
    }
    routineBtnsDivEl.innerHTML = routineBtnsHTML
}

function clickRoutine(routineID){
    console.log("Routine ID: " + routineID)
    window.location.href += `/routine/${routineID}`

}


console.log(baseURL)
fetch(`${baseURL}/data`)
    .then(resp => resp.json())
    .then(rawData => {
        routines = rawData.Routines
        setUpRoutines()
    })