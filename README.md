# opfs


`opfs` is a thin wrapper around [OPFS](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API#origin_private_file_system) providing high level functions to interact with the private file system.


```sh
npm config set @mickaelvieira:registry https://npm.pkg.github.com
```

```sh
yarn add @mickaelvieira/opfs
```
or


```sh
npm install @mickaelvieira/opfs
```


## Examples

Writing from an input file.

```js
import * as fs from '@mickaelvieira/opfs';

const input = document.querySelector('input[type="file"]');
input.addEventListener('change', function(event: Event) {
  for (const file of this.files) {
    const handle = await fs.createFile(file.name, file);
  }
});
```

Writing from a string.

```js
import * as fs from '@mickaelvieira/opfs';

const file = await fs.createFile('foo/bar.txt', 'This is a string');
const entries = await fs.readDir('foo');

console.log(entries);
// Map(1) {'foo/bar.txt' => FileSystemFileHandle}
```

Removing a file.

```js
import * as fs from '@mickaelvieira/opfs';

const result = await fs.removeFile('foo/bar.txt')
```

Creating a directory.

```js
import * as fs from '@mickaelvieira/opfs';

const dir = await fs.createDir('foo/bar')
const entries = await fs.readDir(dir);

console.log(entries); // Map(0)
```

Removing a directory.

```js
import * as fs from '@mickaelvieira/opfs';

const result = await fs.removeDir('foo/bar')
```
