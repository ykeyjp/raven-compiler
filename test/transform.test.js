import * as path from 'path';
import test from 'ava';
import * as compiler from '../src/compiler';

const tag1 = `
<template class="$classes"
          name="tag">
    <h1>custom1 tag</h1>
    <p>simple example</p>
</template>

<script>
import foo from 'foo';
this.props = {
    classes: 'custom-tag',
};
</script>

<style>
:root{display:block}
</style>
`;

test('options', t => {
  t.notThrows(() => {
    compiler.options({});
  });
  t.throws(() => {
    compiler.options(null);
  });
  t.throws(() => {
    compiler.options(undefined);
  });
  t.throws(() => {
    compiler.options(1);
  });
  t.throws(() => {
    compiler.options('text');
  });
});

test('transform', async t => {
  const result = await compiler.transform(
    tag1,
    path.resolve(__dirname, 'custom1.tag')
  );
  t.regex(result, /<h1>custom1 tag<\/h1<p>simple example<\/p>/);
  t.regex(result, /:root{display:block}/);
  t.regex(result, /this\.props\s*=\s*{\s*classes:\s*'custom-tag',\s*};/);
});
