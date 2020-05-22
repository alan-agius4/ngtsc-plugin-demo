import * as ts from "typescript";
import * as path from 'path';
import { NgTscPlugin, readConfiguration } from '@angular/compiler-cli';
import { createHash } from "crypto";

function createProgram(
  rootNames: ReadonlyArray<string> | undefined = [],
  options: ts.CompilerOptions = {},
  host?: ts.CompilerHost,
  oldProgram?: ts.EmitAndSemanticDiagnosticsBuilderProgram,
  configFileParsingDiagnostics?: readonly ts.Diagnostic[],
  projectReferences?: readonly ts.ProjectReference[],
): ts.EmitAndSemanticDiagnosticsBuilderProgram {
  console.log("** We're about to create the program! **");

  console.time('NgTscPlugin')
  const ngtsc = new NgTscPlugin(options);
  console.timeEnd('NgTscPlugin')

  const wrappedHost = ngtsc.wrapHost(host as any, rootNames, options);

  const getSourceFile = wrappedHost.getSourceFile;
  wrappedHost.getSourceFile = (...parameters) => {
    const file = getSourceFile.call(wrappedHost, ...parameters) as ts.SourceFile & { version: string};
    if (file && !file.version) {
      file.version = createHash('sha256').update(file.text).digest('hex');
    }

    return file;
  };

  console.time('createEmitAndSemanticDiagnosticsBuilderProgram')
  const program = ts.createEmitAndSemanticDiagnosticsBuilderProgram(rootNames, options, wrappedHost, oldProgram, configFileParsingDiagnostics, projectReferences);
  console.timeEnd('createEmitAndSemanticDiagnosticsBuilderProgram')


  console.time('setupCompilation')
  ngtsc.setupCompilation(program.getProgram(), undefined);
  console.timeEnd('setupCompilation')

  const getSyntacticDiagnostics = program.getSyntacticDiagnostics;
  program.getSyntacticDiagnostics = (sf: ts.SourceFile, token: ts.CancellationToken) => {
    return [
      ...getSyntacticDiagnostics.call(program, sf, token),
      ...ngtsc.getDiagnostics(sf)
    ]
  }

  const emit = program.emit;
  program.emit = (targetSourceFile?: any, writeFile?: any, cancellationToken?: any, emitOnlyDtsFiles?: any, customTransformers?: any) => {
    return emit.call(program, targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, ngtsc.compiler.prepareEmit().transformers)
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
  const formatHost: ts.FormatDiagnosticsHost = {
    getCanonicalFileName: path => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine
  };

  return ts.formatDiagnosticsWithColorAndContext([diagnostic], formatHost);
}

compileSolutionWithWatch({ verbose: true });