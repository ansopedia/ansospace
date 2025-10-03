import mongoose from "mongoose";
import z from "zod";

export const mongooseObjectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), "Invalid ObjectId")
  .transform((val) => new mongoose.Types.ObjectId(val));

export type MongooseObjectId = z.infer<typeof mongooseObjectId>;

export const deviceId = z.string().uuid();

export type DeviceId = z.infer<typeof deviceId>;

/**
 * Convert IResult from ua-parser-js into Zod schema
 * (so that `.extend()` works)
 */
const uaParserResultSchema = z.object({
  ua: z.string().optional(),
  browser: z
    .object({
      name: z.string().optional(),
      version: z.string().optional(),
      major: z.string().optional(),
    })
    .optional(),
  engine: z
    .object({
      name: z.string().optional(),
      version: z.string().optional(),
    })
    .optional(),
  os: z
    .object({
      name: z.string().optional(),
      version: z.string().optional(),
    })
    .optional(),
  device: z
    .object({
      vendor: z.string().optional(),
      model: z.string().optional(),
      type: z.string().optional(),
    })
    .optional(),
  cpu: z
    .object({
      architecture: z.string().optional(),
    })
    .optional(),
});

/**
 * Device info schema with both ua-parser-js fields and custom fields
 */
export const deviceInfoSchema = uaParserResultSchema.extend({
  // Persistent unique ID for the device (client-generated or server-assigned)
  deviceId: deviceId.optional(),
  // Flag for bot detection, useful for blocking automated abuse
  isBot: z.boolean(),
  // IP address of the client
  ip: z.string(),
  // When the request was made (server time)
  timestamp: z.date(),
  // Screen resolution, if client sends it (useful for anomaly detection)
  screen: z
    .object({
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .optional(),
  // Geo info, for security alerts & fraud detection
  geolocation: z
    .object({
      country: z.string().optional(),
      city: z.string().optional(),
      timezone: z.string().optional(),
      lat: z.number().optional(),
      lon: z.number().optional(),
    })
    .optional(),
  // Network metadata for profiling suspicious logins
  network: z
    .object({
      isp: z.string().optional(),
      connectionType: z.string().optional(),
    })
    .optional(),
});

export type DeviceInfo = z.infer<typeof deviceInfoSchema>;

const DEFAULT_PAGINATION_LIMIT = 10;
const MAX_PAGINATION_LIMIT = 100;
const DEFAULT_PAGINATION_OFFSET = 0;

export const paginationSchema = z.object({
  limit: z
    .number()
    .int("Limit must be an integer")
    .min(DEFAULT_PAGINATION_LIMIT, `Limit must be at least ${DEFAULT_PAGINATION_LIMIT}`)
    .max(MAX_PAGINATION_LIMIT, `Limit must be at most ${MAX_PAGINATION_LIMIT}`)
    .default(DEFAULT_PAGINATION_LIMIT),
  offset: z
    .number()
    .int("Limit must be an integer")
    .min(DEFAULT_PAGINATION_OFFSET, `Offset must be at least ${DEFAULT_PAGINATION_OFFSET}`)
    .default(DEFAULT_PAGINATION_OFFSET),
});

export type Pagination = z.infer<typeof paginationSchema>;
