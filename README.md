# Real-Time CC repository

No time to explain, just:
1. `docker-compose build`
2. `docker-compose up`
3. Open `http://localhost:8080/monitor` and create a new channel (e.g. `espn` would be an id)
4. `cd ccr && npm install`
5. `/ccr -D localhost:8080 -C espn -s file_to_stream.ts -v` to stream specified file to the server
