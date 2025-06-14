Task 1.1 Main Challenges
  1. Making sure that each initialized counter maintains its own private state.
  2. Making sure that the prototype methods can access the private values in the counter function.

Task 2.2
  We are creating a prototype first so that all counter instances cna share common methods. this will make th e codebase easier to maintain and improve(extend).

Task 3.2
  1. They should not share the same count variable.
  2. This is done so that each counter has its own state and methods carried out on one instance of a counter doesn't affect the other instance.

Task 6 Question
  counter.increment() modifies the current instance of the counter(it increases the value of the counter by 1) while counter.add(1) returns a new insatance(with initial value 1 more than the original counter instance) and leaves the orignal counter instance untoched.