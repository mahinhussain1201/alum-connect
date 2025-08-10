require("dotenv").config({ path: "../.env" });
const prisma = require("../../utils/prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { MentorSchema, MentorshipSchema } = require("../zodSchemas/mentorModel");
const { json } = require("body-parser");
const basicProfileSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required." }),
  presentCompany: z.string().min(1, { message: "Company name is required." }),
  yearsOfExperience: z
    .number()
    .min(0, { message: "Invalid years of experience." }),
  domain: z.enum(
    [
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
      "BUSINESS_MANAGEMENT",
      "FINANCE",
      "ACCOUNTING",
      "HUMAN_RESOURCES",
      "MARKETING",
      "SALES",
      "OPERATIONS",
      "STRATEGY",
      "PROJECT_MANAGEMENT",
      "SUPPLY_CHAIN_MANAGEMENT",
      "CONSULTING",
      "ENTREPRENEURSHIP",
      "BUSINESS_DEVELOPMENT",
      "BUSINESS_ANALYTICS",
      "ECONOMICS",
      "PUBLIC_RELATIONS",
    ],
    { message: "Invalid domain selected." }
  ),
});

const alumniExperienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
});

// const experiencesSchema = z.array(experienceSchema).min(1, {
//   message: "At least one experience is required.",
// });

const addBasicProfile = async (req, res) => {
  const profile = basicProfileSchema.safeParse(req.body);
  if (!profile.success) {
    const errors = profile.error.errors.map((error) => ({
      message: error.message,
      path: error.path,
    }));
    return res.status(403).json({ message: "Zod validation errors.", errors });
  }

  const existingAlumni = await prisma.alumni.findUnique({
    where: { userId: req.userId },
  });

  if (existingAlumni) {
    return res.status(400).json({
      message:
        "Profile already exists. You have already completed your alumni registration. You can update your details.",
    });
  }

  const alumni = await prisma.alumni.create({
    data: { ...profile.data, userId: req.userId },
  });

  return res
    .status(201)
    .json({ message: "Alumni profile completed successfully.", alumni });
};

const updateBasicProfile = async (req, res) => {
  const alumniId = req.alumniId;
  const basicProfile = req.body;
  const updatedBasicProfile = await prisma.alumni.update({
    where: { id: alumniId },
    data: basicProfile,
  });

  return res
    .status(200)
    .json({
      message: "Basic profile updated sucessfully!",
      updatedBasicProfile,
    });
};

const addExperience = async (req, res) => {
  const validation = alumniExperienceSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.error.errors,
    });
  }

  try {
    if (!req.alumniId) {
      return res.status(403).json({ message: "Alumni profile not found" });
    }

    const experienceData = {
      ...validation.data,
      startDate: new Date(validation.data.startDate), // required
      endDate: validation.data.endDate ? new Date(validation.data.endDate) : null,
      alumniId: req.alumniId,
    };

    await prisma.alumniExperience.create({ data: experienceData });

    return res
      .status(201)
      .json({ message: "Alumni experience added successfully" });
  } catch (err) {
    console.error("Error adding alumni experience:", err);
    return res.status(500).json({
      message: "Internal server error",
      details: err.message,
    });
  }
};

const getBasicProfile = async (req, res) => {
  const basicProfile = await prisma.alumni.findUnique({
    where: { id: req.alumniId },
  });
  return res.status(201).json({ basicProfile });
};

const getExperience = async (req, res) => {
  const pastExperiences = await prisma.alumniExperience.findMany({
    where: { alumniId: req.alumniId },
  });
  return res.status(201).json({ pastExperiences });
};

const addMentorProfile = async (req, res) => {
  req.body.userId = req.userId;
  const profile = MentorSchema.safeParse(req.body);
  if (!profile.success) {
    const errors = profile.error.errors.map((error) => ({
      message: error.message,
      path: error.path,
    }));
    return res.status(403).json({ message: "Zod validation errors.", errors });
  }

  const existingMentor = await prisma.mentor.findUnique({
    where: { userId: req.userId },
  });

  if (existingMentor) {
    return res.status(400).json({
      message: "Mentor Profile exists already. You can update your details.",
    });
  }

  const mentor = await prisma.mentor.create({
    data: { ...profile.data, userId: req.userId },
  });

  return res
    .status(201)
    .json({ message: "Mentor profile completed successfully.", mentor });
};

const getMentorProfile = async (req, res) => {
  try {
    const basicProfile = await prisma.mentor.findUnique({
      where: { userId: req.userId },
    });
    console.log(req.userId);
    
    
    if (!basicProfile) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.status(200).json({ basicProfile });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Mentor profile", error });
  }
};
const updateMentorProfile = async (req, res) => {
  try {
    const mentorUserId = parseInt(req.params.id);
    const alumniId = req.alumniId;
    if(mentorUserId != req.userId){
      return res.status(401).json({ message: "Not authorized to edit someone else's profile" });
    }
    // Find the mentor by userId
    const mentor = await prisma.mentor.findUnique({
      where: { userId: mentorUserId },
    });

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    // Prepare data for updating the mentor profile
    const mentorProfileData = {
      ...req.body,
      keywords: req.body.keywords || mentor.keywords, // Preserving existing keywords if not provided
      experience: req.body.experience || mentor.experience,
      interaction: req.body.interaction || mentor.interaction,
      maxMentees: req.body.maxMentees || mentor.maxMentees,
      currentMentees: req.body.currentMentees || mentor.currentMentees,
      levelsOfMentees: req.body.levelsOfMentees || mentor.levelsOfMentees,
      interests: req.body.interests || mentor.interests,
      linkedinProfile: req.body.linkedinProfile || mentor.linkedinProfile,
      currentOrganization: req.body.currentOrganization || mentor.currentOrganization,
      passingYear: req.body.passingYear || mentor.passingYear,
      availabilityStatus: req.body.availabilityStatus || mentor.availabilityStatus,
    };

    await prisma.mentor.update({
      where: { userId: mentorUserId },
      data: mentorProfileData,
    });

    return res.status(200).json({ message: "Mentor Profile updated successfully" });
  } catch (error) {
    console.error("Error updating Mentor Profile:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


module.exports = {
  addBasicProfile,
  updateBasicProfile,
  addExperience,
  getBasicProfile,
  getExperience,
  getMentorProfile,
  addMentorProfile,
  updateMentorProfile,
};
