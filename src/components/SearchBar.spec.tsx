import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';
import { workflowBlocksMock } from '../dataMock';

const mockOnAddBlock = jest.fn();

describe('Render for SearchBar component', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<SearchBar flowBlockList={workflowBlocksMock} onAddBlock={mockOnAddBlock} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays all available blocks in the options list', () => {
    render(<SearchBar flowBlockList={workflowBlocksMock} onAddBlock={mockOnAddBlock} />);

    const searchBarWrapper = screen.getByTestId('search-bar--wrapper');
    fireEvent.click(searchBarWrapper);

    const options = screen.getAllByTestId('search-bar--list-item');
    expect(options.length).toEqual(workflowBlocksMock.length);
  });

  it('only text matching search query is displayed in search input box', () => {
    render(<SearchBar flowBlockList={workflowBlocksMock} onAddBlock={mockOnAddBlock} />);

    const searchBarInput = screen.getByTestId('search-bar--input');
    fireEvent.change(searchBarInput, { target: { value: workflowBlocksMock[0].name } });

    const listItems = screen.getAllByTestId('search-bar--list-item');
    expect(listItems.length).toEqual(1);
  });

  it('calls onAddBlock function with correct data on selecting block', () => {
    render(<SearchBar flowBlockList={workflowBlocksMock} onAddBlock={mockOnAddBlock} />);

    const searchBarInput = screen.getByTestId('search-bar--input');
    fireEvent.change(searchBarInput, { target: { value: workflowBlocksMock[0].name } });

    const listItem = screen.getByText(workflowBlocksMock[0].name);
    fireEvent.mouseDown(listItem);

    expect(mockOnAddBlock).toHaveBeenCalledWith(workflowBlocksMock[0]);
  });
});
