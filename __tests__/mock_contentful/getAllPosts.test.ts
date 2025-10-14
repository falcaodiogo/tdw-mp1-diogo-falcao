import { getAllPosts } from "../../lib/api";

// Mock global fetch
global.fetch = jest.fn();

const mockResponse = {
  data: {
    postCollection: {
      items: [
        {
          slug: "post-1",
          title: "My First Post",
          coverImage: { url: "https://example.com/image.jpg" },
          date: "2025-10-13",
          author: {
            name: "Diogo Falcão",
            picture: { url: "https://diogo.com/pic.jpg" },
          },
          excerpt: "This is an excerpt.",
          content: { json: {} },
        },
      ],
    },
  },
};

describe("getAllPosts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches posts from Contentful and extracts items", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getAllPosts(false);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse.data.postCollection.items);
  });

  it("returns an empty array when no posts found", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest
        .fn()
        .mockResolvedValueOnce({ data: { postCollection: { items: [] } } }),
    });

    const result = await getAllPosts(false);

    expect(result).toEqual([]);
  });
});
