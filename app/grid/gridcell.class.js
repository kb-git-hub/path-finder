import generateQueryConstructor from '../utils/object.utils.js';
import renderEvents from './gridcell/gridcell-events.methods.js';

class GridCell {
    constructor() {
        generateQueryConstructor.call(this, ...arguments);
    }

    get position() {
        return `${this.row}-${this.col}`;
    }

    // this gets elements from the DOM
    // get gridCellElement() return document.querySelector(`.gridCell[position='${this.position}`); // uses this.position to grab 'this' element

    render() {
        this.#renderHTMLElement();
        this.#renderHTMLStyling();
        this.#renderAttributes();
        this.renderGridCellType();
        renderEvents.call(this);
    }

    #renderHTMLElement() {
        const {
            grid: { gridElement },
        } = this;
        const gridCellElement = document.createElement('div');
        gridCellElement.classList.add('gridCell');
        gridCellElement.setAttribute('position', this.position);
        gridElement.append(gridCellElement);

        this.gridCellElement = gridCellElement; // removes need for getter and no longer need to pull browser to get HTML element.
    }

    #renderHTMLStyling() {
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

    #renderAttributes() {
        // add values to this gridCell object
        const {
            grid: { numRows, numCols },
        } = this;
        this.isBlocked = false;
        this.isOutCell = this.position === `0-0`;
        this.isInCell = this.position === `${numRows - 1}-${numCols - 1}`;
    }

    renderGridCellType() {
        const { gridCellElement } = this;
        // if GridCell object has true value for OutCell, add css.
        gridCellElement.classList[this.isOutCell ? 'add' : 'remove']('out-cell');
        gridCellElement.classList[this.isInCell ? 'add' : 'remove']('in-cell');
        gridCellElement.classList[this.isBlocked ? 'add' : 'remove']('blocked');
    }

    resetCell() {
        this.isInCell = false;
        this.isOutCell = false;
        this.isBlocked = false;
        this.renderGridCellType();
    }
}

export default GridCell;
