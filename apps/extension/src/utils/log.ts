export class Logger {
  private tag?: string;

  constructor(tag?: string) {
    this.tag = tag;
  }

  private prefix(icon: string) {
    return this.tag ? `[${icon}][${this.tag}]` : `[${icon}]`;
  }

  dev(...messages: unknown[]) {
    if (!import.meta.env.DEV) return;
    return console.log(this.prefix("🛠️"), ...messages);
  }

  info(...messages: unknown[]) {
    return console.info(this.prefix("ℹ️"), ...messages);
  }

  success(...messages: unknown[]) {
    return console.log(this.prefix("✅"), ...messages);
  }

  warn(...messages: unknown[]) {
    return console.warn(this.prefix("⚠️"), ...messages);
  }

  error(...messages: unknown[]) {
    return console.error(this.prefix("❌"), ...messages);
  }

  // static version if you don't want a tag
  static dev(...messages: unknown[]) {
    if (!import.meta.env.DEV) return;
    return console.log("[🛠️]", ...messages);
  }

  static info(...messages: unknown[]) {
    return console.info("[ℹ️]", ...messages);
  }

  static success(...messages: unknown[]) {
    return console.log("[✅]", ...messages);
  }

  static warn(...messages: unknown[]) {
    return console.warn("[⚠️]", ...messages);
  }

  static error(...messages: unknown[]) {
    return console.error("[❌]", ...messages);
  }
}
