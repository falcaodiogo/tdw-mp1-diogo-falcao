import { formatDate } from "../../app/date";

test("formatDate formats date correctly", () => {
  expect(formatDate("2025-10-05")).toBe("October 5, 2025");
});
