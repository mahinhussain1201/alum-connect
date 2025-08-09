const prisma = require("../../utils/prismaClient");
const { z } = require("zod");

const profileSchema = z.object({
  fullName: z.string().min(1, { message: "full name cannot be empty." }),
  cgpa: z.number().min(0).max(10).optional(),
  cv: z
    .string()
    .url({ message: "CV must be a valid URL." })
    .nullable()
    .optional(),
  department: z.string().min(1, { message: "Department is required." }),
  rollno: z.string().min(1, { message: "Roll number is required." }),
  domain: z
    .enum([
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
    ])
    .optional(),
});

const experienceSchema = z.object({
  title: z.string().min(1, { message: "Title cannot be empty." }),
  description: z.string().min(1, { message: "Description cannot be empty." }),
  techStacks: z
    .array(z.string())
    .min(1, { message: "Please enter atleast one techstack." }),
  startDate: z.union([z.string().datetime(), z.null()]).optional(),
  endDate: z.union([z.string().datetime(), z.null()]).optional(),
});

// const experiencesSchema = z
//   .array(experienceSchema)
//   .min(1, { message: "Enter atleast one experience." });

const addBasicProfile = async (req, res) => {
  const profile = profileSchema.safeParse(req.body);
  if (!profile.success) {
    const errors = profile.error.errors.map((error) => ({
      message: error.message,
      path: error.path,
    }));
    return res.status(403).json({ message: "Zod validation errors.", errors });
  }

  const existingStudent = await prisma.student.findUnique({
    where: { userId: req.userId },
  });

  if (existingStudent) {
    return res.status(400).json({
      message:
        "Profile already exists. You have already completed your student registration. You can update your details.",
    });
  }

  const student = await prisma.student.create({
    data: { ...profile.data, userId: req.userId },
  });

  return res
    .status(201)
    .json({ message: "Student profile completed successfully.", student });
};

const updateBasicProfile = async (req, res) => {
  try {
    const studentId = req.studentId;
    const basicProfile = {
      ...req.body,
      cgpa: req.body.cgpa ? parseFloat(req.body.cgpa) : undefined,
    };

    const updatedBasicProfile = await prisma.student.update({
      where: { id: studentId },
      data: basicProfile,
    });

    return res.status(200).json({
      message: "Basic profile updated successfully!",
      updatedBasicProfile,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating profile", error });
  }
};


const addExperience = async (req, res) => {
  const experience = experienceSchema.safeParse(req.body);

  if (!experience.success) {
    const errors = experience.error.errors.map((error) => ({
      message: error.message,
      path: error.path,
    }));
    return res.status(403).json({ message: "Zod validation errors.", errors });
  }

  const experienceData = {
    ...experience.data,
    studentId,
  };
  await prisma.studentExperience.create({
    data: experienceData,
  });
  return res
    .status(201)
    .json({ message: "Student experiences are added successfully." });
};

const getBasicProfile = async (req, res) => {
  try {
    const basicProfile = await prisma.student.findUnique({
      where: { id: req.studentId },
    });

    if (!basicProfile) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ basicProfile });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving student profile", error });
  }
};

const getExperience = async (req, res) => {
  try {
    const pastExperiences = await prisma.studentExperience.findMany({
      where: { studentId: req.studentId },
    });

    res.status(200).json({ pastExperiences });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving experience", error });
  }
};

module.exports = {
  addBasicProfile,
  updateBasicProfile,
  addExperience,
  getBasicProfile,
  getExperience,
};
