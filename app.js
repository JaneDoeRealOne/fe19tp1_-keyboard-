let editor;
let selectedNoteId = null;

document.addEventListener("DOMContentLoaded", function () {
    // Use this to access html elements when loaded

    editor = new FroalaEditor('#textEditor', {
        toolbarInline: true,
        charCounterCount: false,
        toolbarVisibleWithoutSelection: true

    })


    let btnSave = document.querySelector('#btnSave');

    btnSave.onclick = function () {
        let text = editor.html.get();
        let date = new Date();
        let id = Math.floor((Math.random() * 999) + 99).toString();

        let noteObject = {
            id: id,
            text: text,
            date: date,
            isFavorite: false
        }

        let noteList = getNotes();

        if (selectedNoteId === null || noteList.length === 0) {
            noteList.unshift(noteObject);
            selectedNoteId = id;

        } else {
            for (i = 0; i < noteList.length; i++) {
                if (noteList[i].id === selectedNoteId) {
                    noteList[i].text = text;

                    break;
                }
            }
        }

        setNotes(noteList);

        showNotes();

    };


    showNotes();

    let addBtn = document.querySelector('#addNoteBtn');

    let noteModal = document.querySelector('#addNoteContainer');
    let yesBtn = document.querySelector('#yesBtn');
    let noBtn = document.querySelector('#noBtn');


    addBtn.onclick = function () {
        noteModal.style.display = 'block';
        window.onclick = function (e) {
            if (e.target == noteModal) {
                noteModal.style.display = 'none';
            }
        }
    }

    yesBtn.onclick = function () {
        noteModal.style.display = 'none';
        clearEditor();
        selectedNoteId = null;
        removeSelectionInNoteList();
    }

    noBtn.onclick = function () {
        noteModal.style.display = 'none';
    }


   
    


});



function clearEditor() {
    editor.html.set('<h1></h1>');
}

function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}


function formatDate(date) {
    let monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
    ];

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();
    let hour = addZero(date.getHours());
    let minutes = addZero(date.getMinutes());

    return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + hour + ':' + minutes;
}

function showNotes() {
    let noteRows = document.querySelector('#noteContainer');
    noteRows.innerHTML = '';

    let noteList = getNotes();

    for (i = 0; i < noteList.length; i++) {
        let object = noteList[i];

        let htmlItem;

        if (object.id === selectedNoteId) {
            htmlItem = createNoteSelected(object);
        } else {
            htmlItem = createNote(object);
        }

        noteRows.innerHTML += htmlItem
    }

    function createNote(object) {
        return `
        
        <div id="${object.id}" onclick="noteClicked(this)" class="noteContent">
        <div class="favoriteBtnContainer"><i class="fas fa-star favoriteBtn ${favoriteSelectedNoteCheck(object)}" onclick ="favoriteSelectedNote(this, ${object.id})"></i></div>
        <h1 class="text">${removeHtmlTagsFromText(object.text).substring(0, 15)}</h1>
        <p class="date">${formatDate(new Date(object.date))}</p>
        <div class="deleteBtnContainer"><i class="fas fa-trash-alt deleteBtn" onclick="deleteSelectedNote(this)"></i>
       </div>
        </div>
        `
    }
    

    function createNoteSelected(object) {
        return `
        <div id="${object.id}" onclick="noteClicked(this)" class="noteContent noteContentActive">
        <div class="favoriteBtnContainer"><i class="fas fa-star favoriteBtn ${favoriteSelectedNoteCheck(object)}" onclick ="favoriteSelectedNote(this, ${object.id}"></i></div>
        <h1 class="text">${removeHtmlTagsFromText(object.text).substring(0, 15)}</h1>
        <p class="date">${formatDate(new Date(object.date))}</p>
        <div class="deleteBtnContainer deleteBtnContainerActive"><i class="fas fa-trash-alt deleteBtn" onclick="deleteSelectedNote(this)"></i>
       </div>
        </div>
        `
    }
}


/*favoriteBtnNavbar.onclick = function() {
    
}*/

function favoriteSelectedNoteCheck(object) {

    if (object.isFavorite === true) {
        return 'favoriteBtnActive';
    } else {
        return "";
    }
}


function favoriteSelectedNote(element, parentId) {
    let noteList = getNotes();

    for (i = 0; i < noteList.length; i++) {
        let note = noteList[i];

        if (note.id === parentId.toString()) {

            if (note.isFavorite === true) {
                element.classList.remove('favoriteBtnActive');
                noteList[i].isFavorite = false;

            } else {
                element.classList.add('favoriteBtnActive');
                noteList[i].isFavorite = true;
            }

        }
    }

    setNotes(noteList);

}


function deleteSelectedNote(element) {

    let noteList = getNotes();

    for (i = 0; i < noteList.length; i++) {
        let note = noteList[i];

        if (note.id === selectedNoteId) {
            noteList.splice(i, 1);
            break;
        }
    }

    clearEditor();
    setNotes(noteList);
    showNotes();
}

function getNotes() {

    if (localStorage.getItem('notes') === null) {
        return [];
    } else {
        return JSON.parse(localStorage.getItem('notes'));
    }
}


function setNotes(noteList) {
    localStorage.setItem('notes', JSON.stringify(noteList));
}

function removeSelectionInNoteList() {

    let notes = document.querySelectorAll('.noteContent');

    for (i = 0; i < notes.length; i++) {
        let note = notes[i];
        note.classList.remove("noteContentActive");
        note.querySelector('.deleteBtnContainer').classList.remove('deleteBtnContainerActive');
    }

}


function noteClicked(element) {

    removeSelectionInNoteList();

    element.classList.add("noteContentActive");

    let idNote = element.id;
    let savedNotes = getNotes();

    for (i = 0; i < savedNotes.length; i++) {
        let editNote = savedNotes[i];

        if (editNote.id === idNote) {
            editor.html.set(editNote.text);
        }
    }

    selectedNoteId = idNote;

    element.querySelector('.deleteBtnContainer').classList.add('deleteBtnContainerActive');


}
// function thats remove all Html tags from the text.
function removeHtmlTagsFromText(html) {

    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}


window.onload = function () {

    let container = document.querySelector('#modalContainer');
    let seenModal = localStorage.getItem('seenModal');

    if (seenModal !== 'true') {
        document.querySelector('#modalContainer').style.display = "block";
        container.style.opacity = '1';

        let btnModal = document.querySelector('#btnModal');
        btnModal.onclick = function () {
            container.style.opacity = '0';

            localStorage.setItem('seenModal', 'true');

            container.addEventListener('transitionend', () => {
                container.style.display = 'none';
            });
        }
    }


}