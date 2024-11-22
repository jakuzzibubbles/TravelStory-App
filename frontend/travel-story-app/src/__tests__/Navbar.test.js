import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

describe("Navbar Component", () => {
  const mockUserInfo = { name: "Test User" };
  const mockSetSearchQuery = jest.fn();
  const mockOnSearchNote = jest.fn();
  const mockHandleClearSearch = jest.fn();

  // Simulate token in localStorage
  beforeEach(() => {
    localStorage.setItem("token", "mock-token");
  });

  // Clear localStorage after each test
  afterEach(() => {
    localStorage.clear();
  });

  // Render Navbar component wrapped with Router
  test("logs out when logout button is clicked", () => {
    render(
      <Router>
        <Navbar
          userInfo={mockUserInfo}
          searchQuery=""
          setSearchQuery={mockSetSearchQuery}
          onSearchNote={mockOnSearchNote}
          handleClearSearch={mockHandleClearSearch}
        />
      </Router>
    );

    // Find the logout button
    const logoutButton = screen.getByText(/logout/i);

    // Simulate click event
    fireEvent.click(logoutButton);

    // Assert that localStorage no longer contains the 'token'
    expect(localStorage.getItem("token")).toBeNull();
  });
});