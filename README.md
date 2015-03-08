# Back Row

**Back Row** is a media server for watching movies and shows in a browser, streamed directly from a server.

## Deployment

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/blakeembrey/back-row)

### Configuration

```
export TRAKT_TV_CLIENT_ID=abc
export TRAKT_TV_CLIENT_SECRET=123
export TORRENT_CACHE_LIMIT=10000000000
```

## Developers

```
# Clone the repository locally
git clone https://github.com/blakeembrey/back-row.git

# Install dependencies
cd back-row && npm install

# Run development server
gulp watch

# Build the output directory
gulp build
```

## License

MIT
