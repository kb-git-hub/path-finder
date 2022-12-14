import AStarFinder from '../lib/pathfinding/AStarFinder.js';
import PathFindingGrid from '../lib/pathfinding/Grid.js';
import generateQueryConstructor from '../utils/object.utils.js';

window.AStarFinder = AStarFinder;
window.PathFindingGrid = PathFindingGrid;
class GridPathFinder {
    constructor() {
        generateQueryConstructor.call(this, ...arguments);
    }

    generateHelperGrid() {
        const {
            grid: { gridCells, numRows, numCols },
        } = this;

        const helperGrid = [];
        for (let row = 0; row < numRows; row++) {
            const helperRow = [];
            for (let col = 0; col < numCols; col++) {
                const position = `${row}-${col}`;
                const currentCell = gridCells[position];

                helperRow.push(currentCell.isBlocked ? 1 : 0);
            }
            helperGrid.push(helperRow);
        }
        return helperGrid;
    }

    generateHelperPath() {
        const helperGrid = this.generateHelperGrid();
        const pathFindingGrid = new PathFindingGrid(helperGrid);

        const outColRow = this.generateColRow(this.outCell.position);
        const inColRow = this.generateColRow(this.inCell.position);

        const AStarFinderConfig = {
            weight: this.grid.settings.verticesWeight,
        };
        const aStarFinder = new AStarFinder(AStarFinderConfig);

        const helperPath = aStarFinder.findPath(...outColRow, ...inColRow, pathFindingGrid);
        return helperPath;
    }

    generateColRow(position) {
        const coordinates = position
            .split('-')
            .map((item) => +item)
            .reverse(); // split cell coordinates into an array
        return coordinates;
    }
}

export default GridPathFinder;
