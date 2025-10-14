import { render, screen } from '@testing-library/react';
import Page from '../../app/page';
import * as api from '../../lib/api';
import { draftMode } from 'next/headers';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('next/headers', () => ({
  draftMode: jest.fn(),
}));

jest.mock('../../lib/api', () => ({
  getAllPosts: jest.fn(),
}));

describe('Page component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders "No posts found" when no posts are returned', async () => {
    (draftMode as jest.Mock).mockResolvedValue({ isEnabled: false });
    (api.getAllPosts as jest.Mock).mockResolvedValue([]);

    render(await Page());

    expect(screen.getByText(/No posts found/i)).toBeInTheDocument();
  });

  it('renders hero post when posts are available', async () => {
    (draftMode as jest.Mock).mockResolvedValue({ isEnabled: false });
    (api.getAllPosts as jest.Mock).mockResolvedValue([
      {
        slug: 'post-1',
        title: 'My First Post',
        date: '2025-10-13',
        excerpt: 'Hello world',
        author: { name: 'Diogo Falcão', picture: { url: 'pic.jpg' } },
        coverImage: { url: 'cover.jpg' },
      },
    ]);

    render(await Page());

    expect(screen.getByText('My First Post')).toBeInTheDocument();
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });
});
