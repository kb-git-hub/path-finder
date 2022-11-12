import generateQueryConstructor from '../utils/object.utils.js';

class GridCell {
    constructor() {
        generateQueryConstructor.call(this, ...arguments);
    }

    get position() {
        return `${this.row}-${this.col}`;
    }

    // this gets elements from the DOM
    get gridCellElement() {
        return document.querySelector(`.gridCell[position='${this.position}`); // uses this.position to grab 'this' element
    }

    render() {
        this.#renderElement();
        this.#renderGridCell();
        this.#renderHTML();
        this.#renderOutInCells();
        this.#renderEvents();
    }

    #renderElement() {
        const {
            grid: { gridElement },
        } = this;
        const gridCellElement = document.createElement('div');
        gridCellElement.classList.add('gridCell');
        gridCellElement.setAttribute('position', this.position);
        gridElement.append(gridCellElement);
    }

    #renderGridCell() {
        const {
            grid: { numRows, numCols },
        } = this;
        this.isBlocked = false; // add isBlocked value to the gridCell object
        this.isOutCell = this.position === `0-0`;
        this.isInCell = this.position === `${numRows - 1}-${numCols - 1}`;
    }

    #renderHTML() {
        const {
            gridCellElement,
            grid: {
                settings: { cellSize, borderSize, borderColor },
            },
        } = this;

        Object.assign(gridCellElement.style, {
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            border: `${borderSize}px solid ${borderColor}`,
        });

        gridCellElement.setAttribute('draggable', true); // makes dragging more smooth and shows dragging
    }

    #renderOutInCells() {
        const { gridCellElement } = this;
        // if GridCell object has true value for OutCell, add css.
        gridCellElement.classList[this.isOutCell ? 'add' : 'remove']('out-cell');
        gridCellElement.classList[this.isInCell ? 'add' : 'remove']('in-cell');
    }

    renderBlockedCells() {
        const { gridCellElement } = this;
        gridCellElement.classList[this.isBlocked ? 'add' : 'remove']('blocked');
    }

    #renderEvents() {
        this.#renderClickEvent();
        this.#renderHoverEvent();
        this.#renderDragDropEvents();
    }

    #renderClickEvent() {
        if (this.isOutCell || this.isInCell) return;
        const { gridCellElement } = this; // (getter) Get current Element from DOM and attach listener. getter for Every function
        gridCellElement.addEventListener('click', () => {
            this.isBlocked = !this.isBlocked;
            this.renderBlockedCells();
        });
    }

    #renderHoverEvent() {
        const { gridCellElement } = this;
        gridCellElement.addEventListener('mouseenter', () => {
            if (this.isOutCell || this.isInCell) {
                gridCellElement.style.cursor = 'grab';
            } else if (!this.isBlocked) {
                gridCellElement.style.cursor = 'pointer';
            } else {
                gridCellElement.style.cursor = 'crosshair';
            }
        }); // enter
    }

    #renderDragDropEvents() {
        const { grid, gridCellElement } = this; // grid Class and DOM gridCell

        gridCellElement.addEventListener('dragstart', (e) => {
            if (dontAllowDrag.call(this)) {
                e.preventDefault();
                return;
            }
            grid.draggedGridCell = this;
        });

        gridCellElement.addEventListener('dragover', (e) => {
            if (dontAllowDrop.call(this)) {
                return;
            }
            e.preventDefault();
        });

        gridCellElement.addEventListener('drop', (e) => {
            this.resetCell();
            this.isOutCell = grid.draggedGridCell.isOutCell;
            this.isInCell = grid.draggedGridCell.isInCell;
            this.#renderOutInCells();
            grid.draggedGridCell.resetCell();
            grid.draw();
        });

        function dontAllowDrag() {
            return !this.isInCell && !this.isOutCell;
        }

        function dontAllowDrop() {
            const { gridCellElement, grid } = this;
            if (grid.draggedGridCell.gridCellElement === gridCellElement) return true;
            if (grid.draggedGridCell.isInCell && this.isOutCell) return true;
            if (grid.draggedGridCell.isOutCell && this.isInCell) return true;
            // gridCellElement.matches('.out-cell') is DOM alternative
        }
    }

    resetCell() {
        this.isInCell = false;
        this.isOutCell = false;
        this.isBlocked = false;
        this.#renderOutInCells();
        this.renderBlockedCells();
    }
}

export default GridCell;
