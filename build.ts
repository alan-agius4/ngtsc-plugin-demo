import * as ts from 'typescript';
import { NgTscPlugin, readConfiguration } from '@angular/compiler-cli';
import { resolve } from 'path';

const config = readConfiguration(resolve('tsconfig.json'))
const compilerOptions = config.options;

console.time('NgTscPlugin')
const ngtsc = new NgTscPlugin(compilerOptions)
console.timeEnd('NgTscPlugin')

const host = ts.createCompilerHost(compilerOptions);

// UnifiedModeHost is required in wrapHost type but optional in ngtsc CompilerHost
//const wrappedHost = host;
const wrappedHost = ngtsc.wrapHost(host as any, config.rootNames, compilerOptions)

const program = ts.createProgram({
  options: compilerOptions,
  rootNames: config.rootNames,
  host: wrappedHost,
});
console.time('setupCompilation')
const { ignoreForEmit } = ngtsc.setupCompilation(program, undefined);
console.timeEnd('setupCompilation')

console.time('diagnostics')
const diagnostics = [
  ...ngtsc.getDiagnostics(),
  ...ngtsc.getOptionDiagnostics(),
  ...program.getOptionsDiagnostics(),
  ...program.getGlobalDiagnostics(),
  ...program.getSyntacticDiagnostics(),
  ...program.getSemanticDiagnostics(),
];

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: path => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine
};
console.warn(diagnostics.map(d => ts.formatDiagnostic(d, formatHost)).join('\n'));
console.timeEnd('diagnostics')

console.time('emit')

for (const sf of program.getSourceFiles()) {
  if (ignoreForEmit.has(sf)) {
    continue;
  }

  program.emit(sf, undefined, undefined, undefined, ngtsc.compiler.prepareEmit().transformers)
}
console.timeEnd('emit')
