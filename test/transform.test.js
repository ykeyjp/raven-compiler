import * as path from 'path';
import test from 'ava';
import * as compiler from '../src/compiler';
import sass from '../src/transform/sass';

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
:root {
    display: block;
    h1 {
        font-size: 2rem;
    }
}
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
  t.regex(result, /:root{display:block}:root h1{font-size:2rem}/);
  t.regex(result, /this\.props\s*=\s*{\s*classes:\s*'custom-tag',\s*};/);
});

test('sass', async t => {
  const result1 = await sass({
    data: 'div{span{color:red;}}',
    outputStyle: 'compressed',
    sourceMap: 'string',
  });
  t.regex(result1.css, /^div span{color:red}/);
  t.not(result1.map, '');
  const err = await t.throws(sass({data: 'div{--}'}));
  t.regex(err.message, /^Invalid CSS after/);
});
