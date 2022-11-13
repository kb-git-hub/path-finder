/* eslint-disable import/extensions */
import generateQueryConstructor from '../utils/object.utils.js';
import GridCell from './gridcell.class.js';
import GridDraw from './GridDraw.class.js';

class Grid {
    constructor() {
        generateQueryConstructor.call(this, ...arguments);
    }

    get gridElement() {
        // Gets #grid div from DOM
        return document.querySelector(this.settings.gridSelector);
    }

    get svgElement() {
        // Gets #grid div from DOM
        return document.querySelector(this.settings.gridSVGSelector);
    }

    build = () => {
        this.#buildGridLayout();
        this.#buildGridCell();
        this.#buildGridSvg();
    };

    #buildGridLayout() {
        // Destructure objects into variables from grid.config
        const { settings, gridElement } = this; // get gridElement #grid from DOM
        const { cellSize, borderSize, borderColor } = settings;
        const { innerWidth, innerHeight } = window; // Change this back to window

        const fullCellSize = cellSize + borderSize * 2;

        this.numCols = Math.floor(innerWidth / fullCellSize);
        this.numRows = Math.floor(innerHeight / fullCellSize);

        this.gridWidth = this.numCols * fullCellSize;
        this.gridHeight = this.numRows * fullCellSize;

        this.gridMarginX = (innerWidth - this.gridWidth - borderSize * 2) / 2;
        this.gridMarginY = (innerHeight - this.gridHeight - borderSize * 2) / 2;

        // Assigns inline style properties to the grid element
        Object.assign(gridElement.style, {
            width: `${this.gridWidth}px`,
            height: `${this.gridHeight}px`,
            marginLeft: `${this.gridMarginX}px`,
            marginTop: `${this.gridMarginY}px`,
            border: `${borderSize}px solid ${borderColor}`,
        });
    }

    #buildGridCell() {
        const { numRows, numCols } = this;
        this.gridCells = {};
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const gridCell = new GridCell({ grid: this, row, col });
                gridCell.render();
                this.gridCells[gridCell.position] = gridCell; // takes the position of gridCell and destructures it into key for grid.gridCells
            }
        }
    }

    #buildGridSvg() {
        const { svgElement, gridWidth, gridHeight, gridMarginX, gridMarginY } = this;
        Object.assign(svgElement.style, {
            width: `${gridWidth}px`,
            height: `${gridHeight}px`,
            left: `${gridMarginX}px`,
            top: `${gridMarginY}px`,
        });

        svgElement.setAttribute('viewbox', `0 0 ${gridWidth} ${gridHeight}`);
    }

    draw = () => {
        const { gridCells } = this;
        const gridDraw = new GridDraw({ grid: this });
        gridDraw.draw();
    };
}

export default Grid;
