import { CustomError, summarizeError } from 'js-awe'

// Example usage:
level1();

function level1() {
  level2();
}

function level2() {
  level3();
}

function level3() {
  level4();
}

function level4() {
  level5();
}

function level5() {
  level6();
}

function level6() {
  level7();
}

function level7() {
  level8();
}

function level8() {
  level9();
} 

function level9() {

  level10(); 
}

function level10() {
  level11();
}

function level11() {
  try {
    throw new Error('This is a test error');
  } catch (error) {
    // console.log(error)
    console.log(summarizeError(error));
  }

  console.log('//// Report CustomError /////')
  try {
    throw new CustomError('MY_ERROR_TEST','message with detail error...');
  } catch (error) {
    // console.log(error)
    console.log(summarizeError(error));
  }

  console.log(summarizeError('//// Report Error /////'))
  console.log(summarizeError({a:'//// Report Error /////'}))
} 