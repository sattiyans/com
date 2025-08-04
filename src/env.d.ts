/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
  interface Window {
    DOT_CHATBOT: {
      dotId: string;
      theme: string;
      position: string;
      welcomeMessage: string;
    };
  }
}

export {};
