# PyInteractive

PyInteractive is a static site (no backend) which can run arbitrary Python scripts (with restrictions) in the browser. Ideal for teaching Python or demonstrating scripts and making them visible on the web.

## Usage

1. Clone / fork the repo
2. Add your Python scripts to the `src/py_scripts/` folder
3. Update `src/py_scripts/scriptList.ts` with the name of your script

## Development

1. `yarn install`
2. `yarn dev`

### Restrictions

Supported python packages

- `numpy`
