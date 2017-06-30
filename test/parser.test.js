import test from 'ava';
import parseTemplate from '../src/parser/template';
import parseScript from '../src/parser/script';
import parseStyle from '../src/parser/style';

test('template', t => {
  const result1 = parseTemplate('<template><span>foo.</span></template>');
  t.is(result1.tmpl, '<span>foo.</span>');
  const result2 = parseTemplate('<div><span>foo.</span></div>');
  t.is(result2.tmpl, '');
});

test('script', t => {
  const result1 = parseScript('<script>var a = 1;</script>');
  t.is(result1.code, 'var a = 1;');
  const result2 = parseScript('<div><span>foo.</span></div>');
  t.is(result2.code, '');
});

test('style', t => {
  const result1 = parseStyle('<style>div{display:inline-block;}</style>');
  t.is(result1.code, 'div{display:inline-block;}');
  const result2 = parseStyle('<div><span>foo.</span></div>');
  t.is(result2.code, '');
});
