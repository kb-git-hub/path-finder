import generateQueryConstructor from '../utils/object.utils.js';
import GridPathFinder from './GridPathFinder.class.js';

class GridDraw {
    constructor() {
        generateQueryConstructor.call(this, ...arguments);
    }

    get outCell() {
        const gridCells = Object.values(this.grid.gridCells);
        return gridCells.find((cell) => cell.isOutCell);
    }

    get inCell() {
        const gridCells = Object.values(this.grid.gridCells);
        return gridCells.find((cell) => cell.isInCell);
    }

    draw() {
        const { outCell, inCell, grid } = this;
        const gridPathFinder = new GridPathFinder({ grid, outCell, inCell });

        this.helperPath = gridPathFinder.generateHelperPath();
    }
}

export default GridDraw;
