const deposit = require("./index");

describe("test", () => {
  it("test 1", () => {
    deposit(
      [
        {
          type: "One time",
          portfolios: {
            "High risk": { limit: 10000 },
            Retirement: { limit: 500 },
          },
        },
        {
          type: "Monthly",
          portfolios: { "High risk": { limit: 0 }, Retirement: { limit: 100 } },
        },
      ],
      [10500, 100, 100, 100, 100]
    );
  });
});
