// import * as ts from 'typescript';
// import { NgTscPlugin, readConfiguration } from '@angular/compiler-cli';
// import { resolve } from 'path';
// import { createHash } from 'crypto';

// const config = readConfiguration(resolve('tsconfig.json'))
// const compilerOptions = config.options;

// console.time('NgTscPlugin')
// const ngtsc = new NgTscPlugin(compilerOptions)
// console.timeEnd('NgTscPlugin')

// console.time('createIncrementalCompilerHost')
// const host = ts.createIncrementalCompilerHost(compilerOptions);
// console.timeEnd('createIncrementalCompilerHost')

// // UnifiedModeHost is required in wrapHost type but optional in ngtsc CompilerHost
// //const wrappedHost = host;
// const wrappedHost = ngtsc.wrapHost(host as any, config.rootNames, compilerOptions)

// augmentHostWithVersioning(wrappedHost)

// console.time('createIncrementalProgram')
// //const oldProgram = ngtsc.getNextProgram();
// const program = ts.createIncrementalProgram({
//     options: compilerOptions,
//     rootNames: config.rootNames,
//     host: wrappedHost,
// });

// console.timeEnd('createIncrementalProgram')
// console.time('setupCompilation')
// ngtsc.setupCompilation(program.getProgram(), undefined);
// console.timeEnd('setupCompilation')

// const builder = program
// console.time('diagnostics')
// const diagnostics = [
//     ...ngtsc.getDiagnostics(),
//     ...ngtsc.getOptionDiagnostics(),
//     ...builder.getOptionsDiagnostics(),
//     ...builder.getGlobalDiagnostics(),
//     ...builder.getSyntacticDiagnostics(),
//     ...builder.getSemanticDiagnostics(),
// ];

// const formatHost: ts.FormatDiagnosticsHost = {
//     getCanonicalFileName: path => path,
//     getCurrentDirectory: ts.sys.getCurrentDirectory,
//     getNewLine: () => ts.sys.newLine
// };
// console.warn(diagnostics.map(d => ts.formatDiagnostic(d, formatHost)).join('\n'));
// console.timeEnd('diagnostics')

// console.time('emit')
// builder.emit();
// console.timeEnd('emit')

// function augmentHostWithVersioning(host: ts.CompilerHost): void {
//     const baseGetSourceFile = host.getSourceFile;
//     host.getSourceFile = function (...parameters) {
//         const file = baseGetSourceFile.call(host, ...parameters) as any;
//         if (file && file.version === undefined) {
//             file.version = createHash('sha256').update(file.text).digest('hex');
//         }

//         return file;
//     };
// }


import * as ts from "typescript";
import * as path from 'path';
import { NgTscPlugin, readConfiguration } from '@angular/compiler-cli';
import { createHash } from "crypto";


function createProgram(
  rootNames: ReadonlyArray<string> | undefined,
  options?: ts.CompilerOptions,
  host?: ts.CompilerHost,
  oldProgram?: ts.EmitAndSemanticDiagnosticsBuilderProgram,
  configFileParsingDiagnostics?: readonly ts.Diagnostic[],
  projectReferences?: readonly ts.ProjectReference[],
): ts.EmitAndSemanticDiagnosticsBuilderProgram {
  console.log("** We're about to create the program! **");

  console.time('NgTscPlugin')
  const ngtsc = new NgTscPlugin(options || {})
  console.timeEnd('NgTscPlugin')

  const wrappedHost = ngtsc.wrapHost(host as any, rootNames || [], options || {})
  augmentHostWithVersioning(wrappedHost);

  console.time('createEmitAndSemanticDiagnosticsBuilderProgram')
  const program = ts.createEmitAndSemanticDiagnosticsBuilderProgram(rootNames, options, wrappedHost, oldProgram, configFileParsingDiagnostics, projectReferences);
  console.timeEnd('createEmitAndSemanticDiagnosticsBuilderProgram')

  
  console.time('setupCompilation')
  ngtsc.setupCompilation(program.getProgram(), undefined);
  console.timeEnd('setupCompilation')

  const getSyntacticDiagnostics = program.getSyntacticDiagnostics;
  program.getSyntacticDiagnostics = function (sf: ts.SourceFile, token: ts.CancellationToken) {
    return [
      ...getSyntacticDiagnostics(sf, token),
      ...ngtsc.getDiagnostics(sf)
    ]
    
  }

  const emit = program.emit;
  program.emit = function (targetSourceFile?: any, writeFile?: any, cancellationToken?: any, emitOnlyDtsFiles?: any, customTransformers?: any) {
    return emit(targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, ngtsc.compiler.prepareEmit().transformers)
  }
  return program;
};


/**
 * To compile solution similar to tsc --b
 */
function compileSolution(options: ts.BuildOptions): void {
  const host = ts.createSolutionBuilderHost(
    // System like host, default is ts.sys
    /*system*/ undefined,
    // createProgram can be passed in here to choose strategy for incremental compiler just like when creating incremental watcher program.
    // Default is ts.createSemanticDiagnosticsBuilderProgram
    createProgram,
    reportDiagnostic,
    reportSolutionBuilderStatus,
    reportErrorSummary
  );


  const solution = ts.createSolutionBuilder(
    host,
    [tsconfig],
    options
  );

  // Builds the solution
  const exitCode = solution.build();
  console.log(`Process exiting with code '${exitCode}'.`);
  process.exit(exitCode);
}

const tsconfig = path.resolve('tsconfig.json');
/**
 * To compile solution and watch changes similar to tsc --b --w
 */
function compileSolutionWithWatch(options: ts.BuildOptions): void {
  const host = ts.createSolutionBuilderWithWatchHost(
    // System like host, default is ts.sys
    /*system*/ undefined,
    // createProgram can be passed in here to choose strategy for incremental compiler just like when creating incremental watcher program.
    // Default is ts.createSemanticDiagnosticsBuilderProgram
    createProgram,
    reportDiagnostic,
    reportSolutionBuilderStatus,
    reportWatchStatus
  );

  const solution = ts.createSolutionBuilderWithWatch(
    host,
    [tsconfig],
    options
  );

  // Builds the solution and watches for changes
  solution.build()
}

// Reports error
function reportDiagnostic(diagnostic: ts.Diagnostic) {
  console.error(getTextForDiagnostic(diagnostic));
}

// Reports status like Project needs to be built because output file doesnot exist
function reportSolutionBuilderStatus(diagnostic: ts.Diagnostic) {
  console.info(getTextForDiagnostic(diagnostic));
}

// Reports summary with number of errors
function reportErrorSummary(errorCount: number) {
  console.info(`${errorCount} found.`);
}

// Report status of watch like Starting compilation, Compilation completed etc
function reportWatchStatus(diagnostic: ts.Diagnostic) {
  console.info(getTextForDiagnostic(diagnostic));
}

function getTextForDiagnostic(diagnostic: ts.Diagnostic): string {
  if (diagnostic.file) {
    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
      diagnostic.start!
    );
    const message = ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      "\n"
    );
    return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
  } else {
    return `${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;
  }
}

// To compile solution similar to tsc --b
//compileSolution({ verbose: true });

// To compile solution and watch changes similar to tsc --b --w
compileSolutionWithWatch({ verbose: true });

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