import React from "react";
import { render, getByText, getAllByTestId, getByAltText, getByDisplayValue, fireEvent, waitForElement, waitForElementToBeRemoved, getByPlaceholderText, queryByText } from "@testing-library/react";
import axios from "axios";
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

    expect(getByText(appointment, /saving/i)).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, /saving/i));

    expect(getByText(appointment, 'Lydia Miller-Jones')).toBeInTheDocument();

    const mondayDayListItem = getAllByTestId(container, 'day').find(day => queryByText(day, /monday/i));

    expect(getByText(mondayDayListItem, /no spots remaining/i)).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );
    fireEvent.click(getByAltText(appointment, /delete/i));

    expect(getByText(appointment, /are you sure you would like to delete/i)).toBeInTheDocument();

    fireEvent.click(getByText(appointment, /confirm/i));
    expect(getByText(appointment, /deleting/i)).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, /add/i));

    const mondayDayListItem = getAllByTestId(container, 'day').find(day => queryByText(day, /monday/i));
    expect(getByText(mondayDayListItem, /2 spots remaining/i)).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );
    fireEvent.click(getByAltText(appointment, /edit/i));

    expect(getByText(appointment, 'Tori Malcolm')).toBeInTheDocument();

    fireEvent.change(getByDisplayValue(appointment, 'Archie Cohen'), { target: { value: 'Lydia Miller-Jones' } });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    fireEvent.click(getByText(appointment, /save/i));

    expect(getByText(appointment, /saving/i)).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, /saving/i));

    const mondayDayListItem = getAllByTestId(container, 'day').find(day => queryByText(day, /monday/i));
    expect(getByText(mondayDayListItem, /1 spot remaining/i)).toBeInTheDocument;
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(getByAltText(appointment, /edit/i));
    fireEvent.click(getByText(appointment, /save/i));

    await waitForElementToBeRemoved(() => getByText(appointment, /saving/i));

    expect(getByText(appointment, /could not book appointment/i)).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(getByAltText(appointment, /delete/i));
    fireEvent.click(getByText(appointment, /confirm/i));

    await waitForElementToBeRemoved(() => getByText(appointment, /deleting/i));

    expect(getByText(appointment, /could not cancel appointment/i)).toBeInTheDocument();
  });
});


