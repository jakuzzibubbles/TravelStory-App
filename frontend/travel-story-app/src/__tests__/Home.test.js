import React from "react";
import Home from "../pages/Home/Home.jsx";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock dependencies
jest.mock("react-toastify", () => ({
  ToastContainer: () => null,
}));

jest.mock("../components/Navbar.jsx", () => () => <div>Navbar</div>);
jest.mock("../components/Cards/TravelStoryCard.jsx", () => () => (
  <div>TravelStoryCard</div>
));
jest.mock("../components/Cards/EmptyCard.jsx", () => () => <div>EmptyCard</div>);
jest.mock("../components/Cards/FilterInfoTitle.jsx", () => () => (
  <div>FilterInfoTitle</div>
));
jest.mock("../pages/Home/AddEditTravelStory.jsx", () => () => <div>AddEditTravelStory</div>);
jest.mock("../pages/Home/ViewTravelStory.jsx", () => () => <div>ViewTravelStory</div>);

describe("Home Component Snapshot", () => {
  it("renders correctly", () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(container).toMatchSnapshot();
  });
});
