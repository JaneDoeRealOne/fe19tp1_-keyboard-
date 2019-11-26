let editor; // object. Representing Froala editor example get the text from here.
let selectedNoteId = null; // string. Null if no selected note otherwise notes id. 
let selectedNavbarItemIndex = 0; // integer. 0 = homepage, 1 = search, 2 = favorite.

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
        let isFavorite = selectedNavbarItemIndex === 2

        let noteObject = {
            id: id,
            text: text,
            date: date,
            isFavorite: isFavorite
        }

        let noteList = getNotes();


        // When creating new note
        if (selectedNoteId === null || noteList.length === 0) {
            noteList.unshift(noteObject);
            selectedNoteId = id;

        } else { // When editing existing note
            for (i = 0; i < noteList.length; i++) {
                if (noteList[i].id === selectedNoteId) {
                    noteList[i].text = text;
                    noteList[i].date = new Date();

                    break;
                }
            }
        }



        setNotes(noteList);

        if (selectedNavbarItemIndex === 0) {
            showNotes();
        } else if (selectedNavbarItemIndex === 1) {
            setMenuHomePage();

        } else if (selectedNavbarItemIndex === 2) {
            showNotes(getFavoriteNotes());
        }


    };


    showNotes();

    let addBtn = document.querySelector('#addNoteBtn');

    let noteModal = document.querySelector('#addNoteContainer');
    let yesBtn = document.querySelector('#yesBtn');
    let noBtn = document.querySelector('#noBtn');
    let printBtn = document.querySelector('#btnPrint');


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


    printBtn.onclick = function () {
        let printWindow = window.open('', 'PRINT', 'height=400, width=600');
        let content = document.querySelector('.fr-view').innerHTML;
        printWindow.document.write(content);

        printWindow.document.close();

        printWindow.focus();


        // a workaround one the close function, https://stackoverflow.com/questions/6460630/close-window-automatically-after-printing-dialog-closes
        printWindow.onload = function () {
            printWindow.print();
            setTimeout(function () { printWindow.close() }, 500);

        }

    }

    // TODO refactor onclick. Move to seperate function. El


    let searchBtn = document.querySelector('#searchBtn');

    searchBtn.onclick = function () {
        setMenuSearchPage();

    }

    let favBtnNavbar = document.querySelector('#favoriteBtnNavbar');

    favBtnNavbar.onclick = function () {
        setMenuFavoritePage();

    }


    let homeBtn = document.querySelector('#homeBtn');

    homeBtn.onclick = function () {
        setMenuHomePage();

    }





    let statisticBtn = document.querySelector('#statisticBtn');

    /* statisticBtn.onclick = function () {
         setMenuStatisticPage();
         AllCalculateStatistic();
 
 
     }*/


});



function AllCalculateStatistic() {
    let statisticAllNotes = document.querySelector('.totalNotes')
    let statisticAllFavoriteNotes = document.querySelector('.totalFavorites')
    let statisticLatestDateNote = document.querySelector('.latestUpdate')
    let statisticLetterCount = document.querySelector('.totalLetters')

    noteList = getNotes();

    let noteListLength = noteList.length;
    statisticAllNotes.innerHTML = noteListLength;

    let noteListIsfavorite = 0;
    let noteLatestDate = '';

    noteList.forEach(note => {
        if (note.isFavorite === true) {
            noteListIsfavorite += 1;
        }

    });

    statisticAllFavoriteNotes.innerHTML = noteListIsfavorite;


    noteList.forEach(note => {
        if (note.date > noteLatestDate) {
            noteLatestDate = note.date;
        }

    });

    statisticLatestDateNote.innerHTML = formatDate(new Date(noteLatestDate));


    let letterCount = 0;

    noteList.forEach(note => {
        letterCount += removeHtmlTagsFromText(note.text).length;

    });

    statisticLetterCount.innerHTML = letterCount;

}

function showContentContainer() {

    let statisticPage = document.querySelector('.statisticContainer');
    let contentContainer = document.querySelector('.contentContainer');

    statisticPage.classList.remove('statisticContainerActive');
    contentContainer.classList.remove('contentContainerHidden');


}

function setMenuStatisticPage() {

    let statisticBtn = document.querySelector('#statisticBtn');
    let statisticPage = document.querySelector('.statisticContainer');
    let contentContainer = document.querySelector('.contentContainer');

    statisticPage.classList.add('statisticContainerActive');
    contentContainer.classList.add('contentContainerHidden');

    removeActiveClassNavbar();
    statisticBtn.classList.add('active');
    selectedNavbarItemIndex = 3;

}
function setMenuHomePage() {
    showContentContainer();
    let homeTitle = document.querySelector('.noteBordTitle');
    let homeBtn = document.querySelector('#homeBtn');
    homeTitle.innerHTML = 'All notes';
    selectedNoteId = null;
    clearEditor();
    showNotes();

    removeActiveClassNavbar();
    homeBtn.classList.add('active');
    selectedNavbarItemIndex = 0;
    toggleSearchInputField();

}


function setMenuSearchPage() {
    showContentContainer();
    let searchInput = document.querySelector('.searchField');
    let searchBtn = document.querySelector('#searchBtn');
    let searchTitle = document.querySelector('.noteBordTitle');
    searchTitle.innerHTML = 'Search results';
    selectedNoteId = null;
    clearEditor();
    showNotes([]);

    removeActiveClassNavbar();
    searchBtn.classList.add('active');
    selectedNavbarItemIndex = 1;
    toggleSearchInputField();
    searchInput.addEventListener('keyup', () => {
        showNotes(getSearchResult());

    });
}

function setMenuFavoritePage() {
    showContentContainer();

    let favBtnNavbar = document.querySelector('#favoriteBtnNavbar');
    let FavoriteTitle = document.querySelector('.noteBordTitle');
    selectedNoteId = null;
    clearEditor();
    getFavoriteNotes();
    FavoriteTitle.innerHTML = 'Favorite notes';
    showNotes(getFavoriteNotes());
    selectedNavbarItemIndex = 2;
    toggleSearchInputField();

    removeActiveClassNavbar();
    favBtnNavbar.classList.add('active');
}

function removeActiveClassNavbar() {
    let allMenuItems = document.querySelectorAll('.navMenu li');

    allMenuItems.forEach(menuItem => {
        menuItem.classList.remove('active');

    });

}


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


function showNotes(notes = getNotes()) {
    let noteRows = document.querySelector('#noteContainer');
    noteRows.innerHTML = '';

    notes.sort(function (b, a) {
        return new Date(a.date) - new Date(b.date);
    });

    for (i = 0; i < notes.length; i++) {
        let object = notes[i];

        let htmlItem;

        if (object.id === selectedNoteId) {
            htmlItem = createNoteSelected(object);
        } else {
            htmlItem = createNote(object);
        }

        noteRows.innerHTML += htmlItem
    }

    function createNote(object) { // Create html string based on noteObject data. 
        return `
        
        <div id="${object.id}" onclick="noteClicked(this)" class="noteContent">
        <div class="starAndTitleContainer"> <div class="favoriteBtnContainer"><i class="fas fa-star favoriteBtn ${favoriteSelectedNoteCheck(object)}" onclick ="favoriteSelectedNote(this, ${object.id})"></i></div>
        <h1 class="title">${removeHtmlTagsFromText(object.text).substring(0, 15)}</h1></div>
       <div class="dateAndTrashBtnContainer"><p class="date">${formatDate(new Date(object.date))}</p>
        <div class="deleteBtnContainer"><i class="fas fa-trash-alt deleteBtn" onclick="deleteSelectedNote(this)"></i>
       </div></div>
        </div>
        `
    }

    // Create html string, that adding active class on the string for marking item as active. 

    function createNoteSelected(object) {
        return `
        <div id="${object.id}" onclick="noteClicked(this)" class="noteContent noteContentActive">
       <div class="starAndTitleContainer"> <div class="favoriteBtnContainer"><i class="fas fa-star favoriteBtn ${favoriteSelectedNoteCheck(object)}" onclick ="favoriteSelectedNote(this, ${object.id})"></i></div>
        <h1 class="title">${removeHtmlTagsFromText(object.text).substring(0, 15)}</h1></div>
        <div class="dateAndTrashBtnContainer"><p class="date">${formatDate(new Date(object.date))}</p>
        <div class="deleteBtnContainer deleteBtnContainerActive"><i class="fas fa-trash-alt deleteBtn" onclick="deleteSelectedNote(this)"></i>
       </div></div>
        </div>
        `
    }
}


function favoriteSelectedNoteCheck(object) {

    if (object.isFavorite === true) {
        return 'favoriteBtnActive';
    } else {
        return "";
    }
}

/**
 * The function toggles isfavorite state by adding or remove css class. 
 * @param {HTMLElement} element 
 * @param {int} parentId 
 */
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

    let deliteNoteContainer = document.querySelector('.deleteNoteContainer');
    let yesDeliteBtn = document.querySelector('#yesDeleteBtn');
    let noDeliteBtn = document.querySelector('#noDeleteBtn');




    deliteNoteContainer.classList.add('deleteNoteContainerActive');

    yesDeliteBtn.onclick = function () {
        deliteNoteContainer.classList.remove('deleteNoteContainerActive');

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

    noDeliteBtn.onclick = function () {
        deliteNoteContainer.classList.remove('deleteNoteContainerActive');
    }



}



function toggleSearchInputField() {

    let inputText = document.querySelector('.searchField');

    if (selectedNavbarItemIndex === 1) {
        inputText.classList.add('searchFieldActive');
    } else {
        inputText.classList.remove('searchFieldActive');
    }
}


function getSearchResult() {

    let searchInput = document.querySelector('.searchField');

    let noteList = getNotes();
    let searchText = searchInput.value.trim().toLowerCase();

    if (searchText === "") {
        return [];
    } else {
        return noteList.filter(note => note.text.toLowerCase().includes(searchText));
    }

}




function getFavoriteNotes() {

    let noteList = getNotes();
    let favorites = noteList.filter(note => note.isFavorite);
    return favorites;
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
/**
 * The function adding a css class when noteObject is clicked. 
 * If the noteObject has saved text itself, the text is showing in the editor.
 * @param {HTMLElement} element 
 */
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
/**
 * Function thats take a string and remove all Html tags from the string.
 * @param {string} html 
 */
function removeHtmlTagsFromText(htmlString) {

    var tmp = document.createElement("DIV");
    tmp.innerHTML = htmlString;
    return tmp.textContent || tmp.innerText || "";
}


// This will be called when page has finished loading.
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