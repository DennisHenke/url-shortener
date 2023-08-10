# URL Shortener

This is my solution for a code challenge, which I did as part of the interview process at a company. The challenge was to implement a URL shortener web app like TinyURL.

Requirements:

- Users can enter a URL and will get a shortened version of the URL
- For the same URL it should always return the same shortened version
- If the shortened URL is requested, a page with a redirect to the original URL should be displayed
- Every shortening and request for the URL should be counted and displayed after shortening
- Anyone can see the statistics

# Solution

The service contains a SPA, which uses React built via Vite, and a node.js backend, using Redis as a datastore.

# How to start

1. git clone this repository
2. in your terminal, navigate to the root of this repository
3. run ´docker-compose up´
4. You can now access the service via http://localhost:3000
