import * as ts from 'typescript';
import { NgTscPlugin, readConfiguration } from '@angular/compiler-cli';
import { resolve } from 'path';
import { createHash } from 'crypto';

const config = readConfiguration(resolve('tsconfig.json'))
const compilerOptions = config.options;

console.time('NgTscPlugin')
const ngtsc = new NgTscPlugin(compilerOptions)
console.timeEnd('NgTscPlugin')

console.time('createIncrementalCompilerHost')
const host = ts.createIncrementalCompilerHost(compilerOptions);
console.timeEnd('createIncrementalCompilerHost')

// UnifiedModeHost is required in wrapHost type but optional in ngtsc CompilerHost
//const wrappedHost = host;
const wrappedHost = ngtsc.wrapHost(host as any, config.rootNames, compilerOptions)

augmentHostWithVersioning(wrappedHost)

console.time('createIncrementalProgram')
//const oldProgram = ngtsc.getNextProgram();
const program = ts.createIncrementalProgram({
    options: compilerOptions,
    rootNames: config.rootNames,
    host: wrappedHost,
});

console.timeEnd('createIncrementalProgram')
console.time('setupCompilation')
ngtsc.setupCompilation(program.getProgram(), undefined);
console.timeEnd('setupCompilation')

const builder = program
console.time('diagnostics')
const diagnostics = [
    ...ngtsc.getDiagnostics(),
    ...ngtsc.getOptionDiagnostics(),
    ...builder.getOptionsDiagnostics(),
    ...builder.getGlobalDiagnostics(),
    ...builder.getSyntacticDiagnostics(),
    ...builder.getSemanticDiagnostics(),
];

const formatHost: ts.FormatDiagnosticsHost = {
    getCanonicalFileName: path => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine
};
console.warn(diagnostics.map(d => ts.formatDiagnostic(d, formatHost)).join('\n'));
console.timeEnd('diagnostics')

console.time('emit')
builder.emit();
console.timeEnd('emit')

function augmentHostWithVersioning(host: ts.CompilerHost): void {
    const baseGetSourceFile = host.getSourceFile;
    host.getSourceFile = function (...parameters) {
        const file = baseGetSourceFile.call(host, ...parameters) as any;
        if (file && file.version === undefined) {
            file.version = createHash('sha256').update(file.text).digest('hex');
        }

        return file;
    };
}
