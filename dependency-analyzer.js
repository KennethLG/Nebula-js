const ts = require('typescript');
const fs = require('fs');
const path = require('path');

const projectDir = './src'; // Adjust to project root

/**
 * Analyze TypeScript files to detect class dependencies.
 */
function analyzeFileDependencies(filePath, dependencyMap) {
  const source = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest);

  function visit(node) {
    if (ts.isClassDeclaration(node) && node.name) {
      const className = node.name.text;
      const dependencies = new Set();

      node.members.forEach(member => {
        if (ts.isConstructorDeclaration(member)) {
          member.parameters.forEach(param => {
            if (param.type && ts.isTypeReferenceNode(param.type) && ts.isIdentifier(param.type.typeName)) {
              dependencies.add(param.type.typeName.text);
            }
          });
        } else if (ts.isPropertyDeclaration(member) && member.type && ts.isTypeReferenceNode(member.type)) {
          dependencies.add(member.type.typeName.text);
        }
      });

      dependencyMap.set(className, dependencies);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

/**
 * Recursively collects all TypeScript files in the project directory.
 */
function getAllTypeScriptFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const res = path.resolve(dir, entry.name);
    return entry.isDirectory() ? getAllTypeScriptFiles(res) : res.endsWith('.ts') ? [res] : [];
  });
}

/**
 * Sort dependencies topologically to ensure registration order.
 */
function getRegistrationOrder(dependencyMap) {
  const result = [];
  const visited = new Map();

  function visit(node) {
    if (!node) return;
    if (visited.get(node) === true) return; // Already processed
    if (visited.get(node) === false) throw new Error(`Circular dependency detected or undefined dependency: ${node}`);

    visited.set(node, false); // Mark as visiting

    // Visit each dependency and ensure it’s processed first
    const deps = dependencyMap.get(node) || [];
    deps.forEach(dep => {
      if (dependencyMap.has(dep)) visit(dep);
      else {
        console.warn(`Missing or external dependency detected: ${node} depends on ${dep}`);
        dependencyMap.set(dep, new Set()); // Add any missing dependencies
      }
    });

    visited.set(node, true); // Mark as fully processed
    result.push(node); // Add to result
  }

  dependencyMap.forEach((_, key) => {
    if (!visited.has(key)) visit(key);
  });

  return result.reverse(); // Reverse to ensure correct order
}

/**
 * Main function to analyze project and determine registration order.
 */
function analyzeProject() {
  const dependencyMap = new Map();
  const tsFiles = getAllTypeScriptFiles(projectDir);

  tsFiles.forEach(file => analyzeFileDependencies(file, dependencyMap));

  const registrationOrder = getRegistrationOrder(dependencyMap);
  console.log('\nDependency Registration Order:');
  registrationOrder.forEach((dep, index) => console.log(`${index + 1}. ${dep}`));
}

analyzeProject();
