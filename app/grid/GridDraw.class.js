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

    get pathElement() {
        return document.querySelector('path');
    }

    draw() {
        const {
            outCell,
            pathElement,
            inCell,
            grid,
            grid: { svgElement },
        } = this;

        console.log(outCell, inCell);
        const gridPathFinder = new GridPathFinder({ grid, outCell, inCell });

        this.helperPath = gridPathFinder.generateHelperPath();

        pathElement.setAttribute('d', this.buildPathD());
    }

    buildPathD() {
        const {
            outCell,
            inCell,
            grid: {
                settings: { cellSize, borderSize },
            },
        } = this;

        const [rowOut, colOut] = outCell.position.split('-').map((item) => +item);
        const [rowIn, colIn] = inCell.position.split('-').map((item) => +item);

        function generateM(startPos) {
            return startPos * cellSize - cellSize / 2 + startPos * borderSize * 2;
        }

        const m1 = generateM(colOut + 1);
        const m2 = generateM(rowOut + 1);

        let pathD = `M${m1} ${m2}`;
        const distance = cellSize + borderSize * 2;

        for (let i = 0; i < this.helperPath.length - 1; i += 1) {
            const [col, row] = this.helperPath[i];
            const [colNext, rowNext] = this.helperPath[i + 1];

            if (colNext < col) pathD += `h-${distance}`;
            else if (colNext > col) pathD += `h${distance}`;
            else if (rowNext < row) pathD += `v-${distance}`;
            else if (rowNext > row) pathD += `v${distance}`;
        }
        return pathD;
    }
}

export default GridDraw;
