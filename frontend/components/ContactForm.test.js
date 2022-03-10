import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

beforeEach(() => {
    render(<ContactForm/>)
})

test('renders without errors', () => {

});

test('renders the contact form header', () => {
    const header = screen.queryByText(/contact form/i)
    expect(header).toBeInTheDocument()
    expect(header).toBeTruthy()
    expect(header).toHaveTextContent(/contact form/i)
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    const firstName = screen.getByLabelText(/First Name*/i)
    userEvent.type(firstName, '123')
    
    const errorMessage = await screen.findAllByTestId('error')
    expect(errorMessage).toHaveLength(1)
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    const submitButton = screen.getByRole('button')
    userEvent.click(submitButton)

    await waitFor(() => {
        const errorMessage = screen.queryAllByTestId('error')
        expect(errorMessage).toHaveLength(3)
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    const firstName = screen.getByLabelText('First Name*')
    userEvent.type(firstName, 'Tyler')

    const lastName = screen.getByLabelText('Last Name*')
    userEvent.type(lastName, 'Thomson')

    const button = screen.getByRole('button')
    userEvent.click(button)

    const errorMessage = await screen.getAllByTestId('error')
    expect(errorMessage).toHaveLength(1)
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    const email = screen.getByLabelText('Email*')
    userEvent.type(email, 'email')

    const errorMessage = await screen.findByText(/email must be a valid email address/i)
    expect(errorMessage).toBeInTheDocument()
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    const submitButton = screen.getByRole('button')
    userEvent.click(submitButton)

    const errorMessage = await screen.findByText(/lastName is a required field/i)
    expect(errorMessage).toBeInTheDocument()
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    const firstName = screen.getByLabelText(/first name*/i)
    const lastName = screen.getByLabelText(/last name*/i)
    const email = screen.getByLabelText(/email*/i)

    userEvent.type(firstName, 'Tyler')
    userEvent.type(lastName, 'Thomson')
    userEvent.type(email, 'thomson@email.com')

    const button = screen.getByRole('button')
    userEvent.click(button)

    await waitFor(() =>{
        const firstNameDisplay = screen.queryByText('Tyler')
        const lastNameDisplay = screen.queryByText('Thomson')
        const emailDisplay = screen.queryByText('thomson@email.com')
        const messageDisplay = screen.queryByTestId('messageDisplay')

        expect(firstNameDisplay).toBeInTheDocument()
        expect(lastNameDisplay).toBeInTheDocument()
        expect(emailDisplay).toBeInTheDocument()
        expect(messageDisplay).not.toBeInTheDocument()
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    const firstName = screen.getByLabelText(/First Name*/i)
    const lastName = screen.getByLabelText(/Last Name*/i)
    const email = screen.getByLabelText(/Email*/i)
    const message = screen.getByLabelText(/Message/i)

    userEvent.type(firstName, 'Johnny')
    userEvent.type(lastName, 'Doe')
    userEvent.type(email, 'address@email.com')
    userEvent.type(message, 'message')

    const button = screen.getByRole('button')
    userEvent.click(button)

    await waitFor(() =>{
        const firstNameDisplay = screen.queryByText(/John/i)
        const lastNameDisplay = screen.queryByText(/Doe/i)
        const emailDisplay = screen.queryByText(/address@email.com/i)
        const messageDisplay = screen.queryByTestId(/message/i)

        expect(firstNameDisplay).toBeInTheDocument()
        expect(lastNameDisplay).toBeInTheDocument()
        expect(emailDisplay).toBeInTheDocument()
        expect(messageDisplay).toBeInTheDocument()
    })
});
