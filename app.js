let editor;

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
            "id": id, 
            "text": text, 
            "date": date, 
            "isFavorite": false
        }

        noteList.unshift(noteObject);

        localStorage.setItem('notes', JSON.stringify(noteList));

        showNotes();
    };

    showNotes();



})


function showNotes() {
    let noteRows = document.querySelector('#noteContainer');
    noteRows.innerHTML = '';

    if (localStorage.getItem('notes') === null) {
        noteList = [];
    } else {
        noteList = JSON.parse(localStorage.getItem('notes'))
    }



    for (i = 0; i < noteList.length; i++) {
        let object = noteList[i];

        let htmlItem = creatNote(object);

        noteRows.innerHTML += htmlItem
    }

    function creatNote(object) {
        return `
        <div id="${object.id}" onclick="noteClicked(this)" class="noteContent">
        <h1 class="text">${object.text}</h1>
        <p class="date">${object.date}</p>
        </div>
        `
    }
}




function noteClicked(element) {
    

    let notes = document.querySelectorAll('.noteContent');

    for (i = 0; i < notes.length; i++) {
        let note = notes[i];
        note.classList.remove("noteContentActive");
    }

    element.classList.add("noteContentActive");
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