import deleteIcon from './assets/delete-icon.svg'
import editIcon from './assets/edit-icon.svg'

class App {
    constructor() {
        this.notes = [];
        this.title = '';
        this.text = '';
        this.id = '';

        this.$placeHolder = document.querySelector('#placeholder')
        this.$form = document.querySelector('#form');
        this.$noteTitle = document.querySelector('#note-title');
        this.$noteText = document.querySelector('#note-text');
        this.$formButtons = document.querySelector('#form-buttons')
        this.$notes = document.querySelector('#notes')
        this.$closeButton = document.querySelector('#form-close-button')
        this.$modal = document.querySelector('.modal');
        this.$modalTitle = document.querySelector('.modal-title');
        this.$modalText = document.querySelector('.modal-text');
        this.$modalCloseButton = document.querySelector('.modal-close-button');
        this.$colorTooltip = document.querySelector('#color-tooltip');

        this.addEventListeners();
    }

    addEventListeners() {
        document.body.addEventListener('click', (event) => {
            this.handleFormClick(event);
            this.selectNote(event);
            this.openModal(event);
        })

        document.body.addEventListener('mouseover', (event) => {
            this.openTooltip(event);
        })

        document.body.addEventListener('mouseout', (event) => {
            this.closeTooltip(event);
        })

        this.$colorTooltip.addEventListener('mouseover', function () {
            this.style.display = 'flex';
        })

        this.$colorTooltip.addEventListener('mouseout', function () {
            this.style.display = 'none';
        })

        this.$colorTooltip.addEventListener('click', (event) => {
            const color = event.target.dataset.color;
            if (color) {
                this.editNoteColor(color);
            }
        })

        this.$form.addEventListener('submit', (event) => {
            event.preventDefault();
            const title = this.$noteTitle.value;
            const text = this.$noteText.value;
            const hasNote = title || text;
            if (hasNote) {
                this.addNote({ title, text });
            }
        })

        this.$closeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            this.closeForm();
        })

        this.$modalCloseButton.addEventListener('click', () => {
            this.closeModal();
        })
    }

    handleFormClick(event) {
        const isFormClicked = this.$form.contains(event.target);

        const title = this.$noteTitle.value;
        const text = this.$noteText.value;
        const hasNote = title || text;

        if (isFormClicked) {
            this.openForm();
        } else if (hasNote) {
            this.addNote({ title, text });
        } else {
            this.closeForm();
        }
    }

    openForm() {
        this.$form.classList.add('form-open')
        this.$noteTitle.style.display = 'block';
        this.$formButtons.style.display = 'block';
    }

    closeForm() {
        this.$form.classList.remove('form-open')
        this.$noteTitle.style.display = 'none';
        this.$formButtons.style.display = 'none';
        this.$noteTitle.value = "";
        this.$noteText.value = "";
    }

    addNote({ title, text }) {
        const newNote = {
            title: title,
            text: text,
            color: 'white',
            id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1,
        }
        this.notes = [...this.notes, newNote];
        this.displayNotes();
        this.closeForm();
    }

    editNote() {
        const title = this.$modalTitle;
        const text = this.$modalText;
        this.notes = this.notes.map(note =>
            note.id === Number(this.id) ? { ...note, title, text } : note
        )
        this.displayNotes();
    }

    editNoteColor(color) {
        this.notes = this.notes.map(note =>
            note.id === Number(this.id) ? {...note, color} : note
        )
        this.displayNotes();
    }

    selectNote(event) {
        const $selectedNote = event.target.closest('.note');
        if ($selectedNote) {
            const [$noteTitle, $noteText] = $selectedNote.children;
            this.title = $noteTitle.innerText;
            this.text = $noteText.innerText;
            this.id = $selectedNote.dataset.id;
        }
    }

    openModal(event) {
        if (event.target.closest('.note')) {
            this.$modal.classList.toggle('open-modal')
            this.$modalTitle.value = this.title;
            this.$modalText.value = this.text;
        }
    }

    closeModal() {
        this.editNote;
        this.$modal.classList.toggle('open-modal');
    }

    openTooltip(event) {
        if (!event.target.matches('.toolbar-color')) return;
        this.id = event.target.closest('.note').dataset.id;
        const noteCoords = event.target.getBoundingClientRect();
        const horizontal = noteCoords.left + window.scrollX;
        const vertical = noteCoords.top + window.scrollY + 40;
        this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
        this.$colorTooltip.style.display = 'flex';
    }

    closeTooltip(event) {
        if (!event.target.matches('.toolbar-color')) return;
        this.$colorTooltip.style.display = 'none';
    }

    displayNotes() {
        const hasNotes = this.notes.length;
        hasNotes ? this.$placeHolder.style.display = 'none' : this.$placeHolder.style.display = 'flex';

        this.$notes.innerHTML = this.notes.map(note => `
            <div style="background: ${note.color}" class="note" data-id=${note.id}>
                <div class="${note.title && 'note-title'}">${note.title}</div>
                <div class="note-text">${note.text}</div>
                <div class="toolbar-container">
                    <div class="toolbar">
                        <img class="toolbar-color" src="${editIcon}">
                        <img class="toolbar-delete" src="${deleteIcon}">
                    </div>
                </div>
                
            </div> 
        `).join("");
    }
}

new App()