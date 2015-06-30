# Back Row

**Back Row** is a media server for watching movies and shows in a browser, streamed directly from a server.

## Deployment

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/blakeembrey/back-row)

### Configuration

```sh
export TRAKT_TV_CLIENT_ID=abc
export TRAKT_TV_CLIENT_SECRET=123
export TORRENT_CACHE_LIMIT=10000000000 # Defaults to 10GB
export TORRENT_CACHE_PATH=/tmp/torrents # Defaults to `os.tmpdir() + '/torrent-stream'`
```

## Developers

```sh
# Clone the repository locally
git clone https://github.com/blakeembrey/back-row.git

# Install dependencies
cd back-row && npm install

# Run development server
gulp server
# open http://localhost:8080

# Build the output directory
gulp build

# Start application
npm start
# open http://localhost:3000
```

## License

MIT
