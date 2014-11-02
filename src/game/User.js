define("game/User",[],function(){
    function User(){
        this.LifetimeScore = 0;
    }
    (function () {
        if (localStorage.User != null) {
            localStorage.User = new User();
        }
    })();
    return localStorage.User;
});