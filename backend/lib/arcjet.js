import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";

import "dotenv/config";

//init arcjet
export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    // shield protects ur app from common attacks (SQL Injection, XSS, CSRF Attacks)
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      // block all bots except search engines
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        // see full list at https://arcjet.com/bot-list
      ],
    }),

    // RATE LIMITING algo
    // one of many algos for this; can also explore SLIDING WINDOW
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});
