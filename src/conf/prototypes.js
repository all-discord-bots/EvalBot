Array.prototype.remove = function() {
    let value, args = arguments, L = args.length, ax;
    while (L && this.length) {
        value = args[--L];
        while ((ax = this.indexOf(value)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
