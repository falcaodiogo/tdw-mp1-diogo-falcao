// __tests__/home_snapshot.test.jsx
import React from 'react';
import { render } from '@testing-library/react';

// Mock next/headers with a direct function
jest.mock('next/headers', () => ({
  draftMode: jest.fn(() => ({
    isEnabled: false,
  })),
}));

// Mock the API
jest.mock('../lib/api', () => ({
  getAllPosts: jest.fn().mockResolvedValue([
    {
      title: 'Test Hero Post',
      coverImage: { url: '/test-hero-image.jpg' },
      date: '2023-01-01',
      excerpt: 'This is a test hero post excerpt',
      author: { 
        name: 'Test Author', 
        picture: { url: '/test-avatar.jpg' } 
      },
      slug: 'test-hero-post',
      content: { json: {} }
    },
    {
      title: 'Test Post 2',
      coverImage: { url: '/test-image2.jpg' },
      date: '2023-01-02',
      excerpt: 'Another test post',
      author: { 
        name: 'Another Author', 
        picture: { url: '/test-avatar2.jpg' } 
      },
      slug: 'test-post-2',
      content: { json: {} }
    }
  ]),
}));

// Mock child components
jest.mock('../app/cover-image', () => ({
  __esModule: true,
  default: function MockCoverImage({ title, slug, url }) {
    return <img src={url} alt={title} data-testid="cover-image" />;
  },
}));

jest.mock('../app/avatar', () => ({
  __esModule: true,
  default: function MockAvatar({ name, picture }) {
    return (
      <div data-testid="avatar">
        <img src={picture?.url} alt={name} />
        <span>{name}</span>
      </div>
    );
  },
}));

jest.mock('../app/date', () => ({
  __esModule: true,
  default: function MockDate({ dateString }) {
    return <time dateTime={dateString}>Mocked: {dateString}</time>;
  },
}));

jest.mock('../app/more-stories', () => ({
  __esModule: true,
  default: function MockMoreStories({ morePosts }) {
    return (
      <div data-testid="more-stories">
        {morePosts?.map((post) => (
          <div key={post.slug}>{post.title}</div>
        ))}
      </div>
    );
  },
}));

// Import Home after all mocks are set up
import Home from '../app/page';

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot when posts are available', async () => {
    const HomePage = await Home();
    const { asFragment } = render(HomePage);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot when no posts are found', async () => {
    // Get the mocked function and override it for this test
    const { getAllPosts } = await import('../lib/api');
    getAllPosts.mockResolvedValueOnce([]);
    
    const HomePage = await Home();
    const { asFragment } = render(HomePage);
    expect(asFragment()).toMatchSnapshot();
  });
});