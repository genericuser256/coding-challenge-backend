# Notes

## Dependency injection

If this was a production app it would be useful to have DI to simplify the creation of things.
I didn't implement it here to keep things simple and quick, but TSyringe is a good option.
It would have been useful for things like creating instances of the logger for each class.

## Context

While there's a request context it would also be useful to have a shared context that services and the like have access to so their logs can be associated with a particular request. I'm not sure how this is best done, but I know that it can be and is very useful when used correctly.

## Misc

### Ono

`ono` expects an `"ErrorLike"` which doesn't include the `unknown` you get from a catch block. Generally you'd want to not ignore this but that's time consuming and frustrating so just kinda ignoring the issue by casting whenever I use it. Sorry not sorry.

### Naming

`baseModel` is not named `base.model` so it doesn't get picked up by the model auto registration. Annoying but I wasn't really sure how else I wanted to do it.

### Imports

It would be nice to set up an auto barreller & configure proper aliases so things don't have to be relative paths all the time, but decided against.
