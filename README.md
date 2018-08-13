# babel-plugin-require-glob
Babel plugin which gives you ability to require globs.

## Configuration

```bash
$ npm install babel-plugin-require-glob --save-dev
```

In your .babelrc:
```json
{
  "babel": {
    "plugins": [
      [
        "require-glob",
        {
          "pattern": "",
          "options": {}
        }
      ]
    ]
  }
}
```

pattern {String} Pattern to be matched  
options {Object}

## Usage

```javascript
const pages = requireGlob('src/pages')
/**
* src/pages/page1/index.js
* src/pages/page2/index.js
*/
```

It will be transformed into:

```javascript
const pages = {
  page1: require('/your-project/src/pages/page1'),
  page2: require('/your-project/src/pages/page2')
}
```
