# Notes

## Dependency injection

If this was a production app it would be useful to have DI to simplify the creation of things.
I didn't implement it here to keep things simple and quick, but TSyringe is a good option.
It would have been useful for things like creating instances of the logger for each class.

## Context

While there's a request context it would also be useful to have a shared context that services and the like have access to so their logs can be associated with a particular request. I'm not sure how this is best done, but I know that it can be and is very useful when used correctly.

## Testing

### Completeness

While normally I would write thorough unit tests for each file, I'm assuming that for this it's more to get the idea of how I write tests rather than seeing I write every test. As such, I've created a few example test files to show how I usually write tests, but have not done so for everything.

## Challenges

### Express & error handling

This took way longer than it should have but the `errorHandler` middleware needed to be registered as the last handler for it to correctly intercept the error coming from the routes. While obvious in retrospect, it wasn't communicated by the express docs as well as I would have liked. I also found that while the docs state you can just throw inside a handler, I was finding that didn't work so had to use `next` instead to communicate the error.

### Express & query parameters

I had figured that `express` would provide basic type coercion but it doesn't seem to as far as I can tell. As such I had to do a little bit of less than clean code in the `parseAndValidatePaginationQuery` to handle the `string` case. If I had noticed this earlier I probably would have added a validator and coercion library to better handle this but, I found it pretty late in the process and I don't feel like reworking it :).

## Misc

### Jest

When using the initial configuration, I was running into issues with the babel transformations and the decorators used for my model files. It seems to be resolved by switching to the `ts-jest` preset and transformer, but this might vary per machine (not sure why it broke in the first place...). While trying to solve the issue I also bumped the `babel` versions to try and resolve it (to no avail).
`ts-jest` also "suggested" (read, printed annoying warnings) that I upgrade to `jest` v28 so I did.

### Validation

Normally we would want better validation on api endpoints, in this case I kept it simple since the endpoints weren't taking in anything too complex. That said, had there been more complexity, using a library like [`ajv`](https://ajv.js.org/) the often the best way to go. This can also be used for validating the transformations between different versions of a DB model (eg. an `event` might not have the `attendees` and `organizer` optimistically loaded, and verifying that it is loaded is useful).

### Ono

`ono` expects an `"ErrorLike"` which doesn't include the `unknown` you get from a catch block. Generally you'd want to not ignore this but that's time consuming and frustrating so just kinda ignoring the issue by casting whenever I use it. Sorry not sorry.

### Naming

`baseModel` is not named `base.model` so it doesn't get picked up by the model auto registration. Annoying but I wasn't really sure how else I wanted to do it.

### Imports

It would be nice to set up an auto barreller & configure proper aliases so things don't have to be relative paths all the time, but decided against.

### node-fetch

For some reason `node-fetch` v3 has issues with imports on node v14, so need to use `node-fetch` v2 instead.
