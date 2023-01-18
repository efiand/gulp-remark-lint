# gulp-remark-lint

> Gulp task using remark and remark-lint to lint markdown files and output
> stylish results

## Install

```
$ npm i -DE gulp-remark-lint
```

## Usage

Outputs results to stdout.

```js
import gulp from gulp;
import lint from 'gulp-remark-lint';

export default lintMarkdown = () => gulp.src('source/**/*.md')
  .pipe(lint({
    'definition-case': false,
    'emphasis-marker': '_'
  }));
```

## License

MIT © [Andrey N Efimov](https://efiand.ru)
