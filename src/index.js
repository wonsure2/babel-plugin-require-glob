const fs = require('fs')
const pathModule = require('path')
const glob = require('glob')

const expressionName = 'requireGlob'
const currentPath = process.cwd()

function getRequireInfo (node, state, t) {
  if (node.arguments.length < 1) {
    return
  }
  const dirPath = node.arguments[0].value
  const absolutePath = pathModule.resolve(currentPath, dirPath)
  if (!fs.existsSync(absolutePath)) {
    return
  }
  const filePaths = glob.sync(pathModule.resolve(absolutePath, state.opts.pattern || '*'), state.opts.options)
  const objProperties = []
  filePaths.forEach((filePath) => {
    if (!filePath) {
      return
    }
    const propertyName = /\/([^/]+)$/.exec(filePath)[1]
    const requireExp = t.callExpression(t.identifier('require'), [t.stringLiteral(filePath)])
    objProperties.push(t.objectProperty(t.identifier(propertyName), requireExp))
  })
  return {
    objProperties
  }
}

module.exports = function (babel) {
  const t = babel.types
  return {
    visitor: {
      CallExpression (path, state) {
        if (path.node.callee.name === expressionName) {
          const requires = getRequireInfo(path.node, state, t)
          if (!requires) {
            return
          }
          path.replaceWith(t.objectExpression(requires.objProperties))
          path.skip()
        }
      }
    }
  }
}
