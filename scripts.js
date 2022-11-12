/* eslint-disable import/extensions */
import Grid from './app/grid/grid.class.js';
import gridConfig from './app/config/grid.config.js';

const grid = new Grid(gridConfig);

grid.build(); // This build out the grid inside of the class
grid.draw();
