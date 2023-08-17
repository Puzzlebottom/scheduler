import React from "react";
import { render, fireEvent, waitForElement } from "@testing-library/react";
import Application from "components/Application";

describe('Application', () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText('Monday'));

    fireEvent.click(getByText(/tuesday/i));

    expect(getByText(/leopold silvers/i)).toBeInTheDocument();
  });

});
