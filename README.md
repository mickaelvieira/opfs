# opfs


`opfs` is a thin wrapper around [OPFS](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API#origin_private_file_system) providing high level functions to interact with the private file system.


```sh
yarn add opfs
```
or


```sh
npm -i opfs
```


## Examples

Writing from an input file.

```js
import * as fs from 'opfs';

const input = document.querySelector('input[type="file"]');
input.addEventListener('change', function(event: Event) {
  for (const file of this.files) {
    const handle = await fs.writeFile(file.name, file);
  }
});
```

Writing from a string.

```js
import * as fs from 'opfs';

const file = await fs.writeFile('foo/bar.txt', 'This is a string');
const entries = await fs.readDir('foo');

console.log(entries);
// Map(1) {'/foo/bar.txt' => FileSystemFileHandle}
```

Adding a directory.

```js
import * as fs from 'opfs';

const dir = await fs.mkdir('foo/bar')
const entries = await fs.walk();

console.log(entries); // Map(2) {"/foo" => FileSystemDirectoryHandle, /foo/bar" => FileSystemDirectoryHandle}
```

Moving into a directory.

```js
import * as fs from 'opfs';

const dir = await fs.chdir('foo/bar')
console.log(dir.name); // bar

const entries = await fs.walk(dir);
console.log(entries); // Map(0)
```
