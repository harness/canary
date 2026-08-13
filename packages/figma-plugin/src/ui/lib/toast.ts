import type { BannerTone } from "../components/Banner";

/**
 * A transient message plus the severity it should be shown at. Tone travels
 * with the message so a failure can never render as a green success banner.
 */
export type Toast = {
  message: string;
  tone: BannerTone;
};

export const okToast = (message: string): Toast => ({ message, tone: "ok" });
export const infoToast = (message: string): Toast => ({
  message,
  tone: "info",
});
export const warnToast = (message: string): Toast => ({
  message,
  tone: "warn",
});
export const failToast = (message: string): Toast => ({
  message,
  tone: "fail",
});
