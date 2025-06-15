const { createCounter, createAdvancedCounter } = require("../index.js");

describe("Counter Factory Function", () => {
  test("should increment and decrement correctly", () => {
    const counter = createCounter(0);
    expect(counter.getValue()).toBe(0);

    counter.increment();
    expect(counter.getValue()).toBe(1);

    counter.decrement();
    expect(counter.getValue()).toBe(0);
  });

  test("should maintain private state between counters", () => {
    const counter1 = createCounter(0);
    const counter2 = createCounter(10);

    counter1.increment();
    counter1.increment();

    counter2.decrement();

    expect(counter1.getValue()).toBe(2);
    expect(counter2.getValue()).toBe(9);
  });

  test("transform should apply a function to the count", () => {
    const counter = createCounter(5);

    const result = counter.transform((x) => x * 2);
    expect(result).toBe(10);
    expect(counter.getValue()).toBe(10);

    counter.transform((x) => x - 3);
    expect(counter.getValue()).toBe(7);
  });

  test("createPredicate should return a working predicate function", () => {
    const counter = createCounter(4);
    const isAboveThreshold = counter.createPredicate();

    expect(isAboveThreshold(3)).toBe(true);
    expect(isAboveThreshold(5)).toBe(false);
  });

  test("immutable add/subtract/multiply should return new counters without changing original", () => {
    const counter = createCounter(10);

    const added = counter.add(5);
    const subtracted = counter.subtract(3);
    const multiplied = counter.multiply(2);

    expect(counter.getValue()).toBe(10); // the original remains unchanged
    expect(added.getValue()).toBe(15);
    expect(subtracted.getValue()).toBe(7);
    expect(multiplied.getValue()).toBe(20);
  });

  test("snapshot should return a new counter with same value", () => {
    const counter = createCounter(8);
    counter.increment(); // 9

    const snapshot = counter.snapshot();
    expect(snapshot.getValue()).toBe(9);

    snapshot.increment();
    expect(snapshot.getValue()).toBe(10);
    expect(counter.getValue()).toBe(9); // the original is not affected
  });

  test("createAdvancedCounter should not increment beyond max", () => {
    const counter = createAdvancedCounter({ initialValue: 4, max: 5 });

    expect(counter.getValue()).toBe(4);
    counter.increment();
    expect(counter.getValue()).toBe(5);

    expect(() => counter.increment()).toThrow("Maximum value reached");
    expect(counter.getValue()).toBe(5);
  });

  test("createAdvancedCounter should not decrement below min", () => {
    const counter = createAdvancedCounter({ initialValue: 1, min: 0 });

    expect(counter.getValue()).toBe(1);
    counter.decrement();
    expect(counter.getValue()).toBe(0);

    expect(() => counter.decrement()).toThrow("Minimum value reached");
    expect(counter.getValue()).toBe(0);
  });

  test("createAdvancedCounter should not transform below min or above max", () => {
    const counter = createAdvancedCounter({ initialValue: 5, min: 0, max: 10 });

    expect(() => counter.transform((x) => x + 6)).toThrow(
      "Maximum value reached"
    );
    expect(() => counter.transform((x) => -5)).toThrow("Minimum value reached");

    // safe transform
    expect(counter.transform((x) => x + 2)).toBe(7);
    expect(counter.getValue()).toBe(7);
  });
});
