# Journey Builder React Coding Challenge
The original challenge instructions are cached [here](./orig_challenge.mhtml)

### API Calls
The original [mock service](https://github.com/mosaic-avantos/frontendchallengeserver) is now served by NextJS via a url that conforms to [the doc](https://api.avantos-dev.io/docs#/operations/action-blueprint-graph-get). Following the example from the mock service the params are ignored however, and instead the static `graph.json` file is returned.

In contrast to the mock service, which would return a 404 if an unhandled http method was called, this NextJS service will return a 405 Method Not Allowed.

## Stack Details
This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `npm create t3-app@latest`.

#### Setup Questions and answers:
* What will your project be called? - `e15ed0`
* Will you be using TypeScript or JavaScript? - `TypeScript`
* Will you be using Tailwind CSS for styling? - `Yes`
* Would you like to use tRPC? - `No`
* What authentication provider would you like to use? - `None`
* What database ORM would you like to use? - `None`
* Would you like to use Next.js App Router? - `Yes`
* Would you like to use ESLint and Prettier or Biome for linting and formatting? - `ESLint/Prettier`
* Should we initialize a Git repository and stage the changes? - `Yes`
* Should we run 'npm install' for you? - `Yes`
* What import alias would you like to use? - `~/`