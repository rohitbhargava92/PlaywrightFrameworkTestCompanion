/**
 * logger.ts
 * Simple leveled logger with timestamps. No external dependencies.
 * Usage: logger.info('Navigating to login page')
 */

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'STEP';

/** Returns the current time as HH:MM:SS for log prefixes. */
function timestamp(): string {
  return new Date().toTimeString().split(' ')[0];
}

/** Formats and prints a log line to stdout/stderr. */
function log(level: LogLevel, message: string): void {
  const prefix = `[${timestamp()}] [${level.padEnd(5)}]`;
  if (level === 'ERROR') {
    console.error(`${prefix} ${message}`);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

export const logger = {
  /** General informational message. */
  info: (message: string) => log('INFO', message),

  /** Something unexpected but non-fatal. */
  warn: (message: string) => log('WARN', message),

  /** An error that likely caused a test failure. */
  error: (message: string) => log('ERROR', message),

  /**
   * A high-level test step — use at the start of each logical action
   * so the log reads like a plain-English test script.
   */
  step: (message: string) => log('STEP', message),
};
