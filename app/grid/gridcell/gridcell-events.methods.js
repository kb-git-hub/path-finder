export default function () {
    renderClickEvent.call(this);
    renderHoverEvent.call(this);
    renderDragDropEvents.call(this);
}

function renderClickEvent() {
    if (this.isOutCell || this.isInCell) return;
    const { grid, gridCellElement } = this; // (getter) Get current Element from DOM and attach listener. getter for Every function
    gridCellElement.addEventListener('click', () => {
        this.isBlocked = !this.isBlocked;
        this.renderGridCellType();
        grid.draw();
    });
}

function renderHoverEvent() {
    const { gridCellElement } = this;
    gridCellElement.addEventListener('mouseenter', () => {
        if (this.isOutCell || this.isInCell) {
            gridCellElement.style.cursor = 'grab';
        } else if (!this.isBlocked) {
            gridCellElement.style.cursor = 'pointer';
        } else {
            gridCellElement.style.cursor = 'crosshair';
        }
    });
}

function renderDragDropEvents() {
    const { grid, gridCellElement } = this; // grid Class and DOM gridCell / But doesn't query Select. appends dom element during  creation.

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
        this.renderGridCellType();
        grid.draggedGridCell.resetCell();
        grid.draw();
    });
}

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
