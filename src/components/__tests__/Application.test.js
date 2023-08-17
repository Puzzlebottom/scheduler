import React from "react";
import { render, getByText, getAllByTestId, getByAltText, fireEvent, waitForElement, waitForElementToBeRemoved, getByPlaceholderText, queryByText } from "@testing-library/react";
import Application from "components/Application";

describe('Application', () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText('Monday'));

    fireEvent.click(getByText(/tuesday/i));

    expect(getByText(/leopold silvers/i)).toBeInTheDocument();
  });

  it('loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, /archie cohen/i));

    const appointment = getAllByTestId(container, 'appointment')[0];


    fireEvent.click(getByAltText(appointment, /add/i));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), { target: { value: 'Lydia Miller-Jones' } });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    fireEvent.click(getByText(appointment, /save/i));

    // console.log(debug());
    expect(getByText(appointment, /saving/i)).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, /saving/i));

    expect(getByText(appointment, 'Lydia Miller-Jones')).toBeInTheDocument();

    const mondayDayListItem = getAllByTestId(container, 'day').find(day => queryByText(day, /monday/i));

    expect(getByText(mondayDayListItem, /no spots remaining/i)).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the first booked appointment.
    // 4. Check that the confirmation message is shown.
    // 5. Click the "Confirm button".
    // 6. Check that the element with the text "Deleting" is displayed.
    // 7. Wait until the element with the text "Deleting disappears".
    // 8. Check that the DayListItem with the text "Monday" has increased by 1".
  });
});


