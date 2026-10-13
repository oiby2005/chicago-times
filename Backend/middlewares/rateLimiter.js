const rateLimit = require('express-rate-limit');

/**
 * Targeted Rate Limiters for Sensitive Endpoints:
 * 1. signInLimiter: Sign-in / login endpoints
 * 2. contactLimiter: Contact us form submission
 * 3. advertiseLimiter: Advertise with us leads submission
 * 4. subscribeLimiter: Subscription and newsletter submissions
 */

// 1. Sign-In Rate Limiter: 5 attempts per 15 minutes per IP
const signInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many sign-in attempts from this connection. Please wait 15 minutes before trying again.',
  },
  statusCode: 429,
});

// 2. Contact Us Rate Limiter: 5 submissions per 1 hour per IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many contact inquiries sent from this connection. Please wait before submitting another message.',
  },
  statusCode: 429,
});

// 3. Advertise With Us Rate Limiter: 5 inquiries per 1 hour per IP
const advertiseLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many advertising requests submitted from this connection. Please wait before submitting another inquiry.',
  },
  statusCode: 429,
});

// 4. Subscribe / Newsletter Rate Limiter: 5 subscription requests per 15 minutes per IP
const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many subscription attempts from this connection. Please wait 15 minutes before trying again.',
  },
  statusCode: 429,
});

module.exports = {
  signInLimiter,
  contactLimiter,
  advertiseLimiter,
  subscribeLimiter,
};
