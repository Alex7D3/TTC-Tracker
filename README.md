# About
TTC Tracker is a web application used to view information about TTC buses and travel routes, both in the form of live 
TTC updates and preplanned schedules. Users can create, modify, delete, and view details of custom routes.

# Roadmap of Updates
## Swap to PostgreSQL - GTFS Data
  This is more of a developer/maintainability change I would like to do. It will be a significant refactor, so it may take some time.
  > The Toronto Transit Commision and Toronto Open Data plan to change the Real-Time Next Vehicle Arrival (NVAS) data format by Q1 2024. In the near future, this application may stop working. The plan is to update the app
once this change takes place, and rewrite the backend to use PostgreSQL over mongoDB. There are a few reasons for this change in database
software:
  - The data format of live data is likely to change from XML provided by a REST API to GTFS Realtime. GTFS Realtime can easily be
inserted into a relational database, and this provides better opportunities for caching the data.
  - The static form of GTFS that the TTC currently provides is of a higher quality than that provided by the REST API, and this data is
best formatted in a relational database.
  - As it stands now, the data integrity is not ideal using mongoDB with the REST API. There are situations in the current implementation requiring cross-collection referencing that would be simplified by using join operations in a relational database. This will help
reduce data redundancy (use normalized data), improve efficiency, and reduce query complexity.

## Rewrite in TypeScript
  Another maintainability change, having types will help keep the codebase more readible and allow for faster development time.
  This is a simple change to make.
## Live Messages
  A helpful feature the application does not take advantage of is live service update messages provided by the REST API. 

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
