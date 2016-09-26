var userInput = require('user-input');
var Mapping = require('user-input-mapping');

var mapping = new Mapping(
    userInput()
        .withMouse()
        .withKeyboard(),
    {
        keyboard: {
            '<shift>': '<shift>',
            'cancel': '<escape>',
            'up': ['<up>', 'W'],
            'down': ['<down>', 'S'],
            'left': ['<left>', 'A'],
            'right': ['<right>', 'D'],
            'zoomIn': ['=', '<num-+>'],
            'zoomOut': ['-', '<num-->']
        },
        mouse: {
            'mouse0': 'mouse0',
            'mouse1': 'mouse1',
            'mouse2': 'mouse2',
            'mouseX': 'x',
            'mouseY': 'y'
        }
    },
    false);

var value = mapping.value.bind(mapping);
var clear = mapping.clear.bind(mapping);
value.clear = clear;
module.exports = value;
