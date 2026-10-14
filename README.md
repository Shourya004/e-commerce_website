# e-jwel

The Angular application is in [`frontend/`](./frontend/).

The app source is organized by responsibility:

```text
frontend/
  public/                 Static assets
  src/
    app/
      core/               App-wide handlers and services
      features/           Route-level feature pages
      layouts/            Page layouts
      shared/             Reusable components
    environments/         Environment configuration
```

From that directory, install dependencies and start the development server:

```sh
npm install
npm start
```

Build the application with:

```sh
npm run build
```
