type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

function sanitize(data: unknown): unknown {
  if (!data || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(sanitize);
  }
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (
      key.toLowerCase().includes('key') ||
      key.toLowerCase().includes('token') ||
      key.toLowerCase().includes('secret') ||
      key.toLowerCase().includes('password')
    ) {
      result[key] = typeof value === 'string' && value.length > 8 ? `${value.slice(0, 4)}••••${value.slice(-4)}` : '••••';
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitize(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export const logger = {
  log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const sanitized = context ? sanitize(context) : undefined;
    const entry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(sanitized ? { context: sanitized } : {}),
    };
    if (level === 'error') {
      console.error(JSON.stringify(entry));
    } else if (level === 'warn') {
      console.warn(JSON.stringify(entry));
    } else {
      console.log(JSON.stringify(entry));
    }
  },
  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  },
  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  },
  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  },
  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  },
};
