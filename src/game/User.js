function User() {
    this.lifetimeScore = 0;
}
const localStorage = typeof localStorage !== 'undefined' ? localStorage : {};
if (localStorage.user == null)
    localStorage.user = new User();

module.exports = localStorage.user;

