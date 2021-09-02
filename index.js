const MAX_DEPOSIT_PLANS = 2;

class Queue extends Array {
  enqueue(val) {
    this.push(val);
  }

  dequeue() {
    return this.shift();
  }

  peek() {
    return this[0];
  }

  isEmpty() {
    return this.length === 0;
  }

  setFirst(val) {
    this[0] = val;
  }
}

/**
 * @description
 * Deposit takes a list of deposit plans and a list of deposits that will
 * be credited into the specific deposit plans
 *
 * @param {{
 *          type: String
 *          portfolios: {
 *              id: {
 *                  limit: Number
 *              }
 *          }
 *        }[]} depositPlan - List of deposit plans
 * @param {Number[]} deposits - Number of deposits
 *
 * @example
 * deposit([
 *  {
 *    type: "One time",
 *    portfolios: {
 *      "High risk": {
 *        limit: 10000
 *      }
 *    }
 *  }],
 * [10000])
 * //=> { "High risk": 10000 }
 *
 * deposit([
 *  {
 *    type: "One time",
 *    portfolios: {
 *      "High risk": {
 *        limit: 5000
 *      }
 *    }
 *  }],
 * [10000])
 * //=> { "High risk": 5000 }
 *
 * deposit([
 *  {
 *    type: "Monthly",
 *    portfolios: {
 *      "Retirement": {
 *        limit: 100
 *      }
 *    }
 *  }],
 * [100])
 * //=> { "Retirement": 100 }
 *
 * deposit([
 *  {
 *    type: "One time",
 *    portfolios: {
 *      "High risk": {
 *        limit: 10000
 *      }
 *      "Retirement": {
 *        limit: 500
 *      }
 *    }
 *  },
 *  {
 *    type: "Monthly",
 *    portfolios: {
 *      "High risk": {
 *        limit: 0
 *      }
 *      "Retirement": {
 *        limit: 100
 *      }
 *    }
 *  }
 * ],
 * [10500, 100])
 * //=> { "One time": 10000, "Retirement": 600 }
 *
 */
function deposit(depositPlan, deposits) {
  if (!depositPlan || depositPlan.length == 0)
    throw new Error("You must pass a non-empty deposit plans.");

  if (depositPlan.length > MAX_DEPOSIT_PLANS)
    throw new Error("Exceeded amount of deposit plans.");

  if (!deposits || deposits.length == 0)
    throw new Error("You must pass a non-empty deposits.");

  const oneTimeDepositPlan = depositPlan.find(
    (plan) => plan.type === "One time"
  );

  const monthlyDepositPlan = depositPlan.find(
    (plan) => plan.type === "Monthly"
  );

  if (!oneTimeDepositPlan && !monthlyDepositPlan)
    throw new Error("Invalid plan types.");

  // building the balance object here
  const account = Object.keys(depositPlan[0].portfolios).reduce(
    (previous, current) => {
      return { ...previous, ...{ [current]: { balance: 0 } } };
    },
    {}
  );

  // need to remove the one time deposit plan when it has been deposited
  const queueDeposits = new Queue(...deposits);

  // the order is very important here, it ensures that we do the one time first
  const queueDepositPlans =
    oneTimeDepositPlan && monthlyDepositPlan
      ? new Queue(...[oneTimeDepositPlan, monthlyDepositPlan])
      : !oneTimeDepositPlan
      ? new Queue(...[monthlyDepositPlan])
      : new Queue(...[oneTimeDepositPlan]);

  /* ? new Queue(...[oneTimeDepositPlan, monthlyDepositPlan])
    : new Queue(...[monthlyDepositPlan]); */

  /* const queueDepositPlans = oneTimeDepositPlan
    ? new Queue(...[oneTimeDepositPlan, monthlyDepositPlan])
    : new Queue(...[monthlyDepositPlan]); */

  while (queueDeposits.length > 0) {
    if (queueDepositPlans.isEmpty()) break;
    let currentDeposit = queueDeposits.peek();
    let currentDepositPlan = queueDepositPlans.peek();
    let portfolios = currentDepositPlan.portfolios;

    for (const property in portfolios) {
      let currentBalance = account[property].balance;
      if (currentDeposit < portfolios[property].limit) {
        currentBalance = currentBalance + currentDeposit;
      } else {
        currentBalance = currentBalance + portfolios[property].limit;
      }
      currentDeposit = currentDeposit - portfolios[property].limit;
      account[property].balance = currentBalance;
    }

    if (currentDepositPlan.type === "One time") queueDepositPlans.dequeue();

    // uncomment this if you want to process the same deposit over and over again
    // queueDeposits.setFirst(currentDeposit);

    // if (queueDeposits.peek() === 0) {
    //   queueDeposits.dequeue();
    // }

    queueDeposits.dequeue();
  }

  return account;
}

// export default deposit;
module.exports = deposit;
