import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const router = await import('data:text/javascript;base64,' + Buffer.from(read('public/assets/js/router.js')).toString('base64'));

test('reference links reject fractional, negative and unsafe numbers', () => {
  for (const value of ['1.5', '-1', 'Infinity', '9007199254740992', 'abc']) {
    globalThis.window = {location: {search: `?chapter=${value}&verse=${value}`}};
    assert.equal(router.parseRoute().chapter, null);
    assert.equal(router.parseRoute().verse, null);
  }
  globalThis.window = {location: {search: '?book=John&chapter=3&verse=16&edition=kjv'}};
  assert.deepEqual(router.parseRoute(), {book:'John', chapter:3, verse:16, edition:'kjv'});
});

function worker(fetch) {
  const handlers = {}, messages = [];
  const context = {self:{addEventListener:(type, handler)=>handlers[type]=handler},
    caches:{open:async()=>({match:async()=>null,put:async()=>{}})},fetch,Request,
  };
  vm.runInNewContext(read('public/sw.js'),context);
  let pending;
  handlers.message({data:{type:'CACHE_OFFLINE_LIBRARY'},source:{postMessage:m=>messages.push(m)},waitUntil:p=>pending=p});
  return {done:()=>pending,messages};
}
test('failed offline downloads report an error instead of hanging', async () => {
  for (const fetch of [async()=>{throw Error('offline')},async()=>({ok:false})]) {
    const run=worker(fetch); await run.done();
    assert.equal(run.messages.at(-1).type,'OFFLINE_LIBRARY_ERROR');
    assert.equal(run.messages.some(m=>m.type==='OFFLINE_LIBRARY_COMPLETE'),false);
  }
});
test('both editions contain every indexed book and chapter', () => {
  for (const edition of ['kjv','kjv1611']) {
    const index=JSON.parse(read(`public/data/${edition}/index.json`));
    assert.equal(index.length,edition === 'kjv' ? 66 : 80);
    for(const book of index) {
      const data=JSON.parse(read(`public/data/${edition}/${book.slug}.json`));
      assert.equal(Object.keys(data.chapters).length,book.chapters,`${edition} ${book.book}`);
      for(let ch=1;ch<=book.chapters;ch++) assert.ok(Object.keys(data.chapters[ch]).length,`${edition} ${book.book} ${ch}`);
    }
  }
});
test('edited source files match the deployed public copies', () => {
  for(const file of ['sw.js','assets/js/app.js','assets/js/router.js']) assert.equal(read(file),read('public/'+file),file);
});
