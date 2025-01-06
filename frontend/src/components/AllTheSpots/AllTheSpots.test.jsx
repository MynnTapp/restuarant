import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AllTheSpots from './AllTheSpots';

describe('AllTheSpots Component', () => {
    it('renders correctly', () => {
        render(<AllTheSpots />);
        expect(screen.getByText(/some text/i)).toBeInTheDocument();
    });
});