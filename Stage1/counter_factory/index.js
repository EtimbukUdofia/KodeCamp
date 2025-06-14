const CounterPrototype = {
  increment() {
    this._setCount(this._getCount() + 1);
  },

  decrement() {
    this._setCount(this._getCount() - 1);
  },

  getValue() {
    return this._getCount();
  },

  reset() {
    this._setCount(this._getInitialValue());
  },

  transform(transformFn) {
    this._setCount(transformFn(this._getCount()));
    // return this.getValue();
    return this._getCount();
  },

  createPredicate() {
    const getCount = this._getCount();
    return (threshold) => getCount >= threshold;
  },

  onChange(callback) {
    const originalIncrement = this.increment.bind(this);
    const originalDecrement = this.decrement.bind(this);
    const originalGetCount = this.getValue.bind(this);

    this.increment = () => {
      originalIncrement();
      const newValue = originalGetCount();
      callback(newValue, "Increment");
    };

    this.decrement = () => {
      originalDecrement();
      const newValue = originalGetCount();
      callback(newValue, "Decrement");
    };

    return this;
  },

  add(value) {
    return createCounter(this._getCount() + value);
  },

  subtract(value) {
    return createCounter(this._getCount() - value);
  },

  multiply(value) {
    return createCounter(this._getCount() * value);
  },

  snapshot() {
    return createCounter(this._getCount());
  },

  batch({ increments, decrements }) {
    console.log(increments, decrements);
  },

  getConfig() {
    return this._config;
  }
};

const createCounter = (initialValue = 0) => {
  let count = initialValue;
  let originalValue = initialValue;

  const counter = Object.create(CounterPrototype);

  counter._getCount = () => count;
  counter._setCount = (value) => {
    count = value;
  };
  counter._getInitialValue = () => originalValue;

  return counter;
};

const createAdvancedCounter = ({ initialValue = 0, step = 1, min = -Infinity, max = Infinity } = {}) => {
  let count = initialValue;
  originalValue = initialValue;

  const counter = Object.create(CounterPrototype);

  counter._getCount = () => count;
  counter._setCount = (value) => {
    count = value;
  };
  counter._getInitialValue = () => initialValue;
  counter._config = { initialValue, step, min, max };

  return counter;
};

module.exports = createCounter;

const counter1 = createCounter(3);
const counter2 = createCounter(5);

counter1.increment();
counter2.decrement();

console.log(counter1.getValue()); // 4
console.log(counter2.getValue()); // 4

console.log(counter1.transform(x => x * 2)); // 8

console.log(counter1.transform(x => x - 3)); // 5

counter1.onChange((value, operation) => {
  console.log(`New Value is ${value} and the operation is ${operation}`)
}).increment().decrement();

const baseCounter = createCounter(10);

const addCounter = baseCounter.add(5);        // 15
const subtractCounter = baseCounter.subtract(3); // 7
const multiplyCounter = baseCounter.multiply(2); // 20

console.log(baseCounter.getValue());  // 10
console.log(addCounter.getValue());        // 15
console.log(subtractCounter.getValue());   // 7
console.log(multiplyCounter.getValue());   // 20



// counter1.decrement();
// console.log(counter1.getValue());
// console.log(counter2.getValue());
// console.log(counter1._getInitialValue());

// const isAboveThreshold = counter1.createPredicate();
// console.log(isAboveThreshold(5));

// const counter3 = counter1.add(5);
// console.log(counter3.getValue());
// counter3.batch({ increments: 1, decrements: 3, notUsed: 4 });


// const advancedCounter = createAdvancedCounter();
// console.log(advancedCounter.getConfig().max);