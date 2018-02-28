function b(inp) {
    return inp => inp instanceof Array ? inp.join(", ") : inp;
}
const sup = ['hey', 'hello'];
console.log(b(sup));
