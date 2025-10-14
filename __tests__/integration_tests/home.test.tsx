import { render, screen } from '@testing-library/react';
import React from 'react';
import HomePage from '../../app/page';
import '@testing-library/jest-dom';

// Mock the dependencies
jest.mock('next/headers', () => ({
  draftMode: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  getAllPosts: jest.fn(),
}));

jest.mock('../../app/more-stories', () => ({
  __esModule: true,
  default: jest.fn(({ morePosts }) => (
    <div data-testid="more-stories">
      More Stories Component - {morePosts.length} posts
    </div>
  ))
}));

jest.mock('../../app/avatar', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="avatar">Avatar Component</div>)
}));

jest.mock('../../app/date', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="date">Date Component</div>)
}));

jest.mock('../../app/cover-image', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="cover-image">Cover Image Component</div>)
}));

jest.mock('@/lib/constants', () => ({
  CMS_NAME: 'Contentful',
  CMS_URL: 'https://contentful.com'
}));

const mockPosts = [
  {
    title: 'Gemini Post Title',
    slug: 'gemini-post',
    coverImage: { url: 'https://example.com/gemini.jpg' },
    date: '2025-10-13',
    excerpt: 'This is the gemini post excerpt',
    author: {
      name: 'CEO of Gemini or Google or Whatever',
      picture: 'https://example.com/avatar.jpg',
    },
  },
  {
    title: 'Google Pixel Post Title',
    slug: 'second-post',
    coverImage: { url: 'https://example.com/second.jpg' },
    date: '2025-10-12',
    excerpt: 'This is the Google Pixel post excerpt',
    author: {
      name: 'Google yey',
      picture: 'https://example.com/avatar2.jpg',
    },
  },
  {
    title: 'Pixel 9 Pro XL Post Title',
    slug: 'third-post',
    coverImage: { url: 'https://example.com/third.jpg' },
    date: '2025-10-11',
    excerpt: 'This is the Pixel 9 Pro XL post excerpt',
    author: {
      name: 'Love Pixel',
      picture: 'https://example.com/avatar3.jpg',
    },
  },
];

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders intro section with correct content', async () => {
    const { getAllPosts } = require('@/lib/api');
    const { draftMode } = require('next/headers');

    getAllPosts.mockResolvedValue(mockPosts);
    draftMode.mockResolvedValue({ isEnabled: false });

    render(await HomePage());

    // Check intro section
    expect(screen.getByText('Blog de TDW.')).toBeInTheDocument();
    expect(screen.getByText(/Aplicação de exemplo para o MP1 com:/)).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('Contentful')).toBeInTheDocument();
  });

  test('renders hero post when posts exist', async () => {
    const { getAllPosts } = require('@/lib/api');
    const { draftMode } = require('next/headers');

    getAllPosts.mockResolvedValue(mockPosts);
    draftMode.mockResolvedValue({ isEnabled: false });

    render(await HomePage());

    // Check hero post
    expect(screen.getByText('Gemini Post Title')).toBeInTheDocument();
    expect(screen.getByText('This is the gemini post excerpt')).toBeInTheDocument();
    
    // Check that hero post elements are rendered
    expect(screen.getByTestId('cover-image')).toBeInTheDocument();
    expect(screen.getByTestId('date')).toBeInTheDocument();
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  test('renders more stories section with remaining posts', async () => {
    const { getAllPosts } = require('@/lib/api');
    const { draftMode } = require('next/headers');

    getAllPosts.mockResolvedValue(mockPosts);
    draftMode.mockResolvedValue({ isEnabled: false });

    render(await HomePage());

    // Check more stories section (2 posts remaining after hero post)
    expect(screen.getByTestId('more-stories')).toHaveTextContent('2 posts');
  });

  test('renders no posts message when no posts exist', async () => {
    const { getAllPosts } = require('@/lib/api');
    const { draftMode } = require('next/headers');

    getAllPosts.mockResolvedValue([]);
    draftMode.mockResolvedValue({ isEnabled: false });

    render(await HomePage());

    expect(screen.getByText('No posts found. Please check your Contentful configuration.')).toBeInTheDocument();
    expect(screen.queryByTestId('more-stories')).not.toBeInTheDocument();
  });

  test('renders hero post link with correct href', async () => {
    const { getAllPosts } = require('@/lib/api');
    const { draftMode } = require('next/headers');

    getAllPosts.mockResolvedValue(mockPosts);
    draftMode.mockResolvedValue({ isEnabled: false });

    render(await HomePage());

    const heroPostLink = screen.getByRole('link', { name: 'Gemini Post Title' });
    expect(heroPostLink).toHaveAttribute('href', '/posts/gemini-post');
  });

  test('handles draft mode correctly', async () => {
    const { getAllPosts } = require('@/lib/api');
    const { draftMode } = require('next/headers');

    getAllPosts.mockResolvedValue(mockPosts);
    draftMode.mockResolvedValue({ isEnabled: true });

    render(await HomePage());

    // Verify that getAllPosts was called with draft mode enabled
    expect(getAllPosts).toHaveBeenCalledWith(true);
    expect(screen.getByText('Gemini Post Title')).toBeInTheDocument();
  });
});