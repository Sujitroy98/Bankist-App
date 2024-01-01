import 'core-js/actual'

//!--------------login details------------------
// js 1111, jd 2222, kr 3333, sr 4444

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-12-03T15:01:17.194Z',
    '2023-12-04T23:36:17.929Z',
    '2023-12-05T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-11-25T14:18:46.235Z',
    '2023-11-05T16:33:06.386Z',
    '2023-12-05T14:43:26.374Z',
    '2023-12-05T18:49:59.371Z',
    '2023-12-06T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Kankichi Ryotsu',
  movements: [200, -200, 3400, -300, 3500, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2022-11-30T09:18:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-01-25T14:12:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-11-10T14:43:26.374Z',
    '2023-12-25T18:50:59.371Z',
    '2023-12-26T12:01:20.894Z',
  ],
  currency: 'JPY',
  locale: 'ja-JP',
};

const account4 = {
  owner: 'Suman Rai',
  movements: [430, 1000, 7000, 5000, 90, 860, 530, 2500],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:16:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-09-25T14:18:46.235Z',
    '2023-09-05T16:26:06.386Z',
    '2023-12-10T12:01:20.894Z',
    '2023-12-12T14:43:26.374Z',
    '2023-12-12T18:48:59.371Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const accounts = [account1, account2, account3, account4];
  
  // Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



//!------------------------------------------- Functions-------------------------------------------------
//MOVEMENTS DATE
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return Intl.DateTimeFormat(locale).format(date);
  }
};
// Formatting Currencies
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// DISPLAY MOVEMENTS------------------------------------------------------------------------------------
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
          <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
  
  // DISPLAY BALANCE----------------------------------------------------------------
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};
  
 // DISPLAY SUMMARY-----------------------------------------------------------------
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => Math.abs(acc + mov), 0);
  labelSumOut.textContent = formatCur(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(interest);
};

// CREATING USERNAMES------------------------------------------------------------------
const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

//Update UI --------------------------------------------------------------------------------
const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);

  //Display balance
  calcDisplayBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
};

// LOGOUT TIMER-------------------------------------------------------------------------------
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining Time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 second, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    //decrease 1s
    time--;
  };
  // Set Time to 5min
  let time = 60 * 10;

  //Call The Timer Every Second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

  //! -------------------------------------------------Event handlers---------------------------------------------//
let currentAccount, timer;

//? FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(account1);
// containerApp.style.opacity = 100;

// lOG IN ------------------------------------------------------------------------------
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  // Prevent form from submitting
  currentAccount = accounts.find(
    acc => inputLoginUsername.value === acc.username
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    //Display UI and Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    console.log('Logged in');

    //Display Current Date and Time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'short',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    //Update UI
    updateUI(currentAccount);
  }
});

// TRANSFER MONEY -----------------------------------------------------------------------
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferTo.value = inputTransferAmount.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Doing The Transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // ADD transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);

    // Reset Timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// LOAN ---------------------------------------------------------------------------
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // ADD Movements
      currentAccount.movements.push(amount);

      // ADD Loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      // UPDATE UI
      updateUI(currentAccount);

      // Reset Timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }

  inputLoanAmount.value = '';
});

// DELETING ACCOUNT ----------------------------------------------------------------------
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    //DELETE ACCOUNt
    accounts.splice(index, 1);

    //HIDE USERNAME
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Account Deleted`;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

// SORTING TRANSACTIONS------------------------------------------------------------------------
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});