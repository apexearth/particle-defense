function User() {
    this.LifetimeScore = 0;
}
var localStorage = typeof localStorage !== "undefined" ? localStorage : {}
if (localStorage.User == null)
    localStorage.User = new User();

module.exports = localStorage.User

