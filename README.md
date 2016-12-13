# WeatherForecastApp

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.22-1.

## Install application into a development machine or a build server
Clone application project from Github with following commands

```bash
$ git clone https://github.com/siannilli/weather-forecast-app.git 
$ cd weather-forecast-app
$ npm install 
```

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `ng serve -prod` for a dev server running with production settings.

## Settings
Folder `src/environments` contains setting files for different environments.
In development mode, the application uses an in-memory service with static forecast data (updated asof 10th December 2016).

To use Yahoo! Weather service change `useInMemoryService` setting to `true` in file `src/environments/environment.ts`, as per the following example. 

```typescript
export const environment = {
  production: false,
  useInMemoryService: true
};
```

In production mode, the application (`ng serve -prod`) always uses the Yahoo! Weather API to get forecast data.

## <a name="build"></a>Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

WeatherForecastApp comes with some `npm` scripts as shortcuts to build processes.

| script         |  description                       |
|----------------|:---------------------------------------------------------|
| `start`        | start a light web server serving the applciation.       
| `clean:dist`   | delete the ./dist folder |
| `clean:all`    | delete ./dist and ./node_modules folders 
| `build:dev`    | build the application for development environments
| `build:prod`   | build the application for production environments 
| `build:docker` | build the application for pr environments and build a ngnix's Docker image to host the application. 


## Deploy

### Manual deployment
Follow [build instructions](#build) above to build the application according the environment you are setting up.
Each `build:*` script compiles the source files into the `./dist` folder.

Copy the content under `./dist` folder to the folder with static assets served by your running web server (eg. /usr/share/nginx/html in a default nginx instance). 

Browse the web application according the URL address listening by the web server.

### Deploy as Docker container
The script `build:docker` generates a Docker image with the name `weather-forecast-app`, ready to run an nginx server instance serving the web application.

To run a docker container of the image, and start the nginx server instance listening on port 8080, run the following commmand:

```bash
$ docker run --name weather-app -p 8080:80 -d weather-forecast-app
```

Then browse the weather forecast application at the url `http://localhost:8080`.