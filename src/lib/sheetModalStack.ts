class SheetModalStack {
  _stack: String[] = [];

  push(id: String) {
    this._stack.push(id);
  }

  remove(id: String) {
    this._stack = this._stack.filter((v) => v !== id);
  }

  getTop() {
    return this._stack.at(-1);
  }
}
const sheetModalStack = new SheetModalStack();

export default sheetModalStack;
