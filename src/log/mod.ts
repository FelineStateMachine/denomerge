export type LogLevel = "trace" | "debug" | "info" | "warn" | "error"

const NUMERIC: Record<LogLevel, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
}

export interface Logger {
  trace(msg: string, data?: Record<string, unknown>): void
  debug(msg: string, data?: Record<string, unknown>): void
  info(msg: string, data?: Record<string, unknown>): void
  warn(msg: string, data?: Record<string, unknown>): void
  error(msg: string, data?: Record<string, unknown>): void
  /** Returns a child logger with additional fields bound to every entry. */
  child(bindings: Record<string, unknown>): Logger
}

export function createLogger(
  name: string,
  options: { level?: LogLevel; bindings?: Record<string, unknown> } = {},
): Logger {
  const minNumeric = NUMERIC[options.level ?? "info"]
  const bindings = options.bindings ?? {}

  function emit(level: LogLevel, msg: string, data?: Record<string, unknown>): void {
    if (NUMERIC[level] < minNumeric) return
    const line = JSON.stringify({ level, logger: name, msg, ...bindings, ...data })
    switch (level) {
      case "trace":
      case "debug":
        console.debug(line)
        break
      case "info":
        console.info(line)
        break
      case "warn":
        console.warn(line)
        break
      case "error":
        console.error(line)
        break
    }
  }

  return {
    trace: (msg, data) => emit("trace", msg, data),
    debug: (msg, data) => emit("debug", msg, data),
    info: (msg, data) => emit("info", msg, data),
    warn: (msg, data) => emit("warn", msg, data),
    error: (msg, data) => emit("error", msg, data),
    child: (extra) =>
      createLogger(name, { level: options.level, bindings: { ...bindings, ...extra } }),
  }
}
