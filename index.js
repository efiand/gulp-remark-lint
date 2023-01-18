import chalk from 'chalk';
import path from 'node:path';
import { remark } from 'remark';
import remarkPresetLintConsistent from 'remark-preset-lint-consistent';
import remarkPresetLintRecommended from 'remark-preset-lint-recommended';
import through2 from 'through2';
import toVFile from 'convert-vinyl-to-vfile';

export default (plugins = []) =>
  through2.obj(async function (vinyl, encoding, callback) {
    if (vinyl.isNull()) {
      return callback();
    }

    if (vinyl.isStream()) {
      this.emit('error', new Error('Streams are not supported!'));
      return callback();
    }

    try {
      const processor = remark()
        .use(remarkPresetLintConsistent)
        .use(remarkPresetLintRecommended);

      if (plugins.length) {
        processor.use({ plugins });
      }
      const file = await processor.process(toVFile(vinyl));

      if (file.messages.length) {
        console.log(chalk.underline(path.relative(process.cwd(), file.path)));
        file.messages
          .sort((a, b) => a.line - b.line)
          .forEach(({ column, line, reason, ruleId }) =>
            console.error(
              [
                chalk.dim(`${line}:${column}`),
                chalk.red('error'),
                reason,
                chalk.dim(ruleId),
              ].join('  ')
            )
          );
        console.log('');
        process.exitCode = 1;
      }
    } catch (error) {
      this.emit('error', error);
    }
    return callback();
  });
