import * as Sentry from "@sentry/nextjs";

export async function register() {
    if (process.env.CYB_SENTRY_DSN === undefined) {
        console.log("INFO: CYB_SENTRY_DSN is not set. Skipping Sentry initialization.");
        return;
    }

    if (process.env.NEXT_RUNTIME === "nodejs") {
        await import("./sentry.server.config");
    }

    if (process.env.NEXT_RUNTIME === "edge") {
        await import("./sentry.edge.config");
    }
}

export const onRequestError = Sentry.captureRequestError;
