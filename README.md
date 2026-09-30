# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
aube dlx sv@0.17.1 create --template minimal --types ts --add prettier drizzle="database:postgresql+postgresql:postgres.js+docker:yes" better-auth="demo:password,github" paraglide="languageTags:en, es+demo:yes" --install aube team-diagnose
```

## Developing

Open the repository in the `.devcontainer` with VS Code and the Dev Containers extension. The development container includes Node.js and starts the PostgreSQL service; this setup also works with a rootless Podman Compose provider.

Use the VS Code task palette (`Tasks: Run Task`) to start or stop the dev server, or check that it is responding. Port 5173 is forwarded and opens in your browser when the server starts. The database is available in the container at `db:5432` and from the host at `localhost:5432`.

For development directly on the host, install dependencies with `npm install` and run `npm run dev`.

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
