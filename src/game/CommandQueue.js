const queue = module.exports = [];
queue.Commands = {
    StopGame: 'StopGame'
};

queue.process = function (game) {
    var i = queue.length;
    while (i--) {
        if (queue[i] === queue.StopGame) {
            game.stop();
            queue.splice(i, 1);
        }
    }
};