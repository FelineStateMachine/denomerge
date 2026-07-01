import { type Logger as LtLogger, getLogger } from "@logtape/logtape"
export { configure } from "@logtape/logtape"
export type { LogLevel } from "@logtape/logtape"

export interface Logger {
  trace(msg: string, data?: Record<string, unknown>): void
  debug(msg: string, data?: Record<string, unknown>): void
  info(msg: string, data?: Record<string, unknown>): void
  warn(msg: string, data?: Record<string, unknown>): void
  error(msg: string, data?: Record<string, unknown>): void
  child(bindings: Record<string, unknown>): Logger
}

export function createLogger(
  name: string,
  _options?: { level?: string; bindings?: Record<string, unknown> },
): Logger {
  return wrap(getLogger([name]))
}

function wrap(lt: LtLogger): Logger {
  return {
    trace: (msg, data) => lt.trace(msg, data ?? {}),
    debug: (msg, data) => lt.debug(msg, data ?? {}),
    info: (msg, data) => lt.info(msg, data ?? {}),
    warn: (msg, data) => lt.warn(msg, data ?? {}),
    error: (msg, data) => lt.error(msg, data ?? {}),
    child: (_bindings) => wrap(lt),
  }
}
