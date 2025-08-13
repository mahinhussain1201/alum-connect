const { z } = require("zod");

const InteractionLevel = z.enum(["VERY_LOW", "LOW", "HIGH"]);
const MentorshipStatus = z.enum(["PENDING", "ACCEPTED", "REJECTED"]);
const MenteeLevel = z.enum([
  "SECOND_YEAR",
  "THIRD_YEAR",
  "FOURTH_YEAR",
  "FIFTH_YEAR",
  "RESEARCH",
]);
const MentorInterest = z.enum([
  "PRO_BONO_HELP",
  "MENTORING_AND_PARTNERSHIP",
  "INVESTING",
  "NETWORKING",
  "HELPING_IN_NETWORKING",
  "FLOATING_OWN_PROJECTS",
]);
const Domain = z.enum([
  "SOFTWARE",
  "FRONTEND",
  "BACKEND",
  "PRODUCT_MANAGEMENT",
  "WEB_DEVELOPMENT",
  "MOBILE_DEVELOPMENT",
  "MACHINE_LEARNING",
  "DATA_SCIENCE",
  "BLOCKCHAIN",
  "CLOUD_COMPUTING",
  "CYBERSECURITY",
]);

// MENTOR SCHEMA
const MentorSchema = z.object({
  userId: z.number().int().positive(),
  keywords: z.array(Domain).min(1, "Select at least one domain"),
  experience: z.number().int().positive().optional(),
  interaction: InteractionLevel.optional(),
  maxMentees: z.number().int().positive().default(5),
  currentMentees: z.number().int().nonnegative().default(0),
  levelsOfMentees: z.array(MenteeLevel).min(1, "Select at least one mentee level"),
  interests: z.array(MentorInterest).min(1, "Select at least one interest"),
  linkedinProfile: z.string().url().optional().or(z.literal("")),
  currentOrganization: z.string().optional(),
  passingYear: z.number().int().positive().optional(),
  mentorships: z.array(z.any()).optional(),
});

// MENTORSHIP SCHEMA
const MentorshipSchema = z.object({
  mentorId: z.number().int().positive(),
  menteeId: z.number().int().positive(),
  createdAt: z
    .preprocess((arg) => (arg ? new Date(arg) : new Date()), z.date())
    .optional()
    .refine((date) => date <= new Date(), {
      message: "Creation date cannot be in the future.",
    }),
  status: MentorshipStatus.default("PENDING"),
});

// ARRAY OF MENTORSHIPS
const MentorshipsSchema = z.array(MentorshipSchema);

module.exports = { MentorSchema, MentorshipSchema, MentorshipsSchema };
