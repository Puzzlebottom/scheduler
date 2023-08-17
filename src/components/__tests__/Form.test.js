import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import Form from "components/Appointment/Form";

afterEach(cleanup);

describe('Form', () => {

  const interviewers = [
    {
      id: 1,
      student: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ];

  it("renders without crashing", () => {
    render(<Form interviewers={interviewers} />);
  });

  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(<Form interviewers={interviewers} />);

    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  it("renders with initial student name", () => {
    const { getByTestId } = render(<Form interviewers={interviewers} name={'Lydia Miller-Jones'} />);

    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });

  it("validates that the student name is not blank", () => {
    const onSave = jest.fn();

    const { getByText } = render(<Form interviewers={interviewers} onSave={onSave} />);

    fireEvent.click(getByText(/save/i));

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("validates that the interviewer cannot be null", () => {
    const onSave = jest.fn();

    const { getByText } = render(<Form interviewers={interviewers} onSave={onSave} name={"Lydia Miller-Jones"} />);

    fireEvent.click(getByText(/save/i));

    expect(getByText(/please select an interviewer/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("can successfully save after trying to submit an empty student name", () => {
    const onSave = jest.fn();
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form interviewers={interviewers} onSave={onSave} interviewer={1} />
    );

    fireEvent.click(getByText("Save"));

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();

    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByText("Save"));

    expect(queryByText(/student name cannot be blank/i)).toBeNull();

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
  });

  it('calls onCancel and resets the input field', () => {
    const onCancel = jest.fn();

    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form interviewers={interviewers} onSave={jest.fn()} onCancel={onCancel} />
    );

    fireEvent.click(getByText(/save/i));

    fireEvent.change(getByPlaceholderText(/enter student name/i), {
      target: { value: 'Lydia Miller-Jones' }
    });

    fireEvent.click(getByText(/cancel/i));

    expect(queryByText(/student name cannot be blank/i)).toBeNull();

    expect(getByPlaceholderText(/enter student name/i)).toHaveValue("");

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
