import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addConsultationRequest } from '../api/consultationService';
import emailjs from '@emailjs/browser';
import Form from './NewForm';

//captcha
vi.mock('react-google-recaptcha', () => ({
  default: React.forwardRef((props, ref) => {
    if (ref) {
      ref.current = { reset: vi.fn() };
    }

    return (
      <button data-testid="mock-recaptcha" onClick={() => props.onChange('test-token')}>
        Verify CAPTCHA
      </button>
    );
  })
}));

//LocationAutocomplete
vi.mock('./LocationAutocomplete', () => ({
  default: ({ onPlaceSelected }) => (<button data-testid="mock-location" onClick={() => onPlaceSelected({ address: 'Test Location', state: 'CA' })}>
      Select Location
    </button>
  )
}));

//MultiSelectDropdown
vi.mock('./MultiSelectDropdown', () => ({
  default: ({ onChange }) => (<button data-testid="mock-topics" onClick={() => onChange({ target: { name: 'topics', value: ['Topic 1'] } })}>
      Select Topics
    </button>
  )
}));

//email 
vi.mock('@emailjs/browser', () => ({
  default: {send: vi.fn().mockResolvedValue({ status: 200 }) }
}));

vi.mock('../api/consultationService', () => ({
  addConsultationRequest: vi.fn().mockResolvedValue({ success: true })
}));
describe('NewForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should show error when required fields are missing', async () => {
    render(<Form />);
    fireEvent.click(screen.getByText('Next Step'));
    fireEvent.click(screen.getByText('Next Step'));

    expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
  });
}); 