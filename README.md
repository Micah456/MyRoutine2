# MyRoutine2
A simpler version of MyRoutine - A demo organisation App in JS and HTML

## Features
- Create Routines
- Delete Routines
- Update when tasks are completed
- Reset a routine

## Additional Features
- Get stars for completing steps
- Ignore steps
- Update routine details
- Schedule routines
- Display stats
- Animation
- Icons
- Translate to windows/mobile app

## Structure and Technology
- File to store app data - json file
- Server to run webpage and potentially retrieve and store data - python
- Webpage user interface - HTML, JS, CSS

### Webpages
- Homepage (/app) - options to create, or open a routine
- Create routine (/app/routine/create) - create your routine
- Routine (/app/routine/{routine-id}) - update tasks in routine or delete routine. Option to edit
- Edit routine (/app/routine/{routine-id}/edit) edit routien steps and metadata

## Data Structures
JSON structure
Routine:
- Name: string
- Steps: array of step objects
(Note, no id required - id can be based on index in array)

Step:
- Name: string
- Completed: bool

#### Example JSON
`{
    "Routines" : [
        {
            "Name" : "Routine 1",
            "Steps" : [
                {
                    "Name" : "Step1",
                    "Completed": False
                },
                {
                    "Name" : "Step2",
                    "Completed" : False
                }
            ]
        }
    ]
}`
