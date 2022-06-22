# Notes

## Dependency injection

If this was a production app it would be useful to have DI to simplify the creation of things.
I didn't implement it here to keep things simple and quick, but TSyringe is a good option.
It would have been useful for things like creating instances of the logger for each class.

## Context

While there's a request context it would also be useful to have a shared context that services and the like have access to so their logs can be associated with a particular request. I'm not sure how this is best done, but I know that it can be and is very useful when used correctly.

## Misc

### Jest

When using the initial configuration, I was running into issues with the babel transformations and the decorators used for my model files. It seems to be resolved by switching to the `ts-jest` preset and transformer, but this might vary per machine (not sure why it broke in the first place...). While trying to solve the issue I also bumped the `babel` versions to try and resolve it (to no avail).
`ts-jest` also "suggested" (read, printed annoying warnings) that I upgrade to `jest` v28 so I did.

### Ono

`ono` expects an `"ErrorLike"` which doesn't include the `unknown` you get from a catch block. Generally you'd want to not ignore this but that's time consuming and frustrating so just kinda ignoring the issue by casting whenever I use it. Sorry not sorry.

### Naming

`baseModel` is not named `base.model` so it doesn't get picked up by the model auto registration. Annoying but I wasn't really sure how else I wanted to do it.

### Imports

It would be nice to set up an auto barreller & configure proper aliases so things don't have to be relative paths all the time, but decided against.

### node-fetch

For some reason `node-fetch` v3 has issues with imports on node v14, so need to use `node-fetch` v2 instead.
