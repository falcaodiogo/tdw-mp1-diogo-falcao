import { render, screen } from '@testing-library/react';
import React from 'react';
import PostPage from '../../app/posts/[slug]/page';
import '@testing-library/jest-dom';

// Mock the dependencies
jest.mock('next/headers', () => ({
  draftMode: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  getPostAndMorePosts: jest.fn(),
}));

jest.mock('../../app/more-stories', () => ({
  __esModule: true,
  default: jest.fn(() => <div>More Stories</div>)
}));

jest.mock('../../app/avatar', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Avatar</div>)
}));

jest.mock('../../app/date', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Date Component</div>)
}));

jest.mock('../../app/cover-image', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Cover Image</div>)
}));

jest.mock('@/lib/markdown', () => ({
  __esModule: true,
  Markdown: jest.fn(() => <div>Markdown Content</div>)
}));

const mockPost = {
  title: 'Test Post Title',
  author: {
    name: 'Diogo Falcãoaoaoaoa',
    picture: 'https://example.com/avatar.jpg',
  },
  coverImage: {
    url: 'https://example.com/cover.jpg',
  },
  date: '2025-10-13',
  content: 'This is the best post like ever',
};

const mockMorePosts = [
  { title: 'Related Post 1', slug: 'related-1' },
  { title: 'Related Post 2', slug: 'related-2' },
];

describe('PostPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders post title, cover image, date, and content', async () => {
    const { getPostAndMorePosts } = require('@/lib/api');
    getPostAndMorePosts.mockResolvedValue({
      post: mockPost,
      morePosts: mockMorePosts,
    });

    const { draftMode } = require('next/headers');
    draftMode.mockResolvedValue({ isEnabled: false });

    const params = Promise.resolve({ slug: 'test-post' });

    render(await PostPage({ params }));

    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText(/Blog/)).toBeInTheDocument();
    expect(screen.getByText('Date Component')).toBeInTheDocument();
    expect(screen.getByText('Markdown Content')).toBeInTheDocument();
  });

  test('renders author avatar when author exists', async () => {
    const { getPostAndMorePosts } = require('@/lib/api');
    getPostAndMorePosts.mockResolvedValue({
      post: mockPost,
      morePosts: mockMorePosts,
    });

    const { draftMode } = require('next/headers');
    draftMode.mockResolvedValue({ isEnabled: false });

    const params = Promise.resolve({ slug: 'test-post' });

    render(await PostPage({ params }));

    expect(screen.getAllByText('Avatar')).toHaveLength(2);
  });

  test('renders more stories section', async () => {
    const { getPostAndMorePosts } = require('@/lib/api');
    getPostAndMorePosts.mockResolvedValue({
      post: mockPost,
      morePosts: mockMorePosts,
    });

    const { draftMode } = require('next/headers');
    draftMode.mockResolvedValue({ isEnabled: false });

    const params = Promise.resolve({ slug: 'test-post' });

    render(await PostPage({ params }));

    expect(screen.getByText('More Stories')).toBeInTheDocument();
  });
});