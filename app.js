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

        let noteList = getNotes();

        noteList.unshift(noteObject);

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
                noteModal.style.display ='none';
            }
        }
    }

    yesBtn.onclick = function () {
        noteModal.style.display = 'none';
        editor.html.set(''); 
    }

    noBtn.onclick = function () {
        noteModal.style.display = 'none';
    }

   

})


//let textRemove = editor.html.set('');

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

        let htmlItem = creatNote(object);

        noteRows.innerHTML += htmlItem
    }

    function creatNote(object) {
        return `
        <div id="${object.id}" onclick="noteClicked(this)" class="noteContent">
        <h1 class="text">${object.text}</h1>
        <p class="date">${formatDate(new Date(object.date))}</p>
        </div>
        `
    }
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


function noteClicked(element) {

    let notes = document.querySelectorAll('.noteContent');

    for (i = 0; i < notes.length; i++) {
        let note = notes[i];
        note.classList.remove("noteContentActive");
    }

    element.classList.add("noteContentActive");

    let idNote = element.id;
    let savedNotes = getNotes();

    for (i = 0; i < savedNotes.length; i++) {
        let editNote = savedNotes[i];

        if (editNote.id === idNote) {
            editor.html.set(editNote.text);
        }
    }


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


//Print Button btnPrint

function btnPrint(textEditor) {
    let printContent = document.getElementById(textEditor).innerHTML;
    let originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    location.reload();    
 }



 function removeHtmlTagsFromText(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}