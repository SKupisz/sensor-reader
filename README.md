## Sensor Temperature & Humidity system by Szymon Kupisz

## How to use this app?

Run in the command `docker-compose up --build`. After that, connect your socketIO web socket to http://localhost:80. 

## Sending the data to the application

To send the current temperature and humidity, send both of them as numbers in the `message` message with the following structure:

```json
{
  "temperature": 22.5,
  "humidity": 60
}
```

To get the response, listen for the event named `message`.

## Project structure

The project uses one gateway for controlling all of the procedures and functions related to websockets and one service for establishing the connection with the MongoDB database.

## How to test?

Type `npm run test` and prompt the path to the desired test, or not if you want to run all tests available.