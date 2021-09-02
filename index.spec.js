const deposit = require("./index");

describe("constraints", () => {
  it("no deposit plans", () => {
    expect(() => {
      deposit(null, [10]);
    }).toThrow("You must pass a non-empty deposit plans.");
    expect(() => {
      deposit([], [10]);
    }).toThrow("You must pass a non-empty deposit plans.");
  });

  it("no deposits", () => {
    expect(() => {
      deposit([{ type: "One time" }, { type: "Monthly" }], []);
    }).toThrow("You must pass a non-empty deposits.");

    expect(() => {
      deposit([{ type: "One time" }, { type: "Monthly" }]);
    }).toThrow("You must pass a non-empty deposits.");
  });

  it("exceeded deposit plans", () => {
    expect(() => {
      deposit(
        [{ type: "One time" }, { type: "Monthly" }, { type: "Yearly" }],
        [10]
      );
    }).toThrow("Exceeded amount of deposit plans.");
  });

  it("invalid deposit plans", () => {
    expect(() => {
      deposit([{ type: "Kamal" }], [10]);
    }).toThrow("Invalid plan types.");
  });
});

describe("test", () => {
  it("test 1", () => {
    const res = deposit(
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
      [10500, 100]
    );
    expect(res).toEqual({
      "High risk": { balance: 10000 },
      Retirement: { balance: 600 },
    });
  });

  it.skip("test 1.1", () => {
    const res = deposit(
      [
        {
          type: "Monthly",
          portfolios: { "High risk": { limit: 0 }, Retirement: { limit: 100 } },
        },
        {
          type: "One time",
          portfolios: {
            "High risk": { limit: 10000 },
            Retirement: { limit: 500 },
          },
        },
      ],
      [10500, 100]
    );
    expect(res).toEqual({
      "High risk": { balance: 10000 },
      Retirement: { balance: 600 },
    });
  });

  it.only("test 2", () => {
    const res = deposit(
      [
        {
          type: "Monthly",
          portfolios: { "High risk": { limit: 0 }, Retirement: { limit: 100 } },
        },
      ],
      [10500, 100]
    );
    expect(res).toEqual({
      "High risk": { balance: 0 },
      Retirement: { balance: 10600 },
    });
  });
});
