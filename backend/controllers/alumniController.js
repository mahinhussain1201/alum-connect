require("dotenv").config({ path: "../.env" });
const prisma = require("../utils/prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const axios = require("axios");
const { isStudent } = require("../middleware/studentMiddleware");
const { isMentor } = require("../middleware/alumniMiddleware");

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()); // Time set to 00:00:00
};

const postInternship = async (req, res) => {
  // Check the role of the user

  // const startTimeString = "2025-06-01T00:00:00.000Z";  //these are strings
  // const endTimeString = "2025-09-01T00:00:00.000Z";

  // const startTime = new Date(startTimeString); //since prisma excepts a DateTime i.e Date object not a string
  // const endTime = new Date(endTimeString);

  // console.log(startTime); // Output: Sun Jun 01 2025 00:00:00 GMT+0000 (UTC)  //DateTime objects
  // console.log(endTime);   // Output: Mon Sep 01 2025 00:00:00 GMT+0000 (UTC)

  const internshipData = {
    ...req.body,
    domain: req.body.domain.toUpperCase(),
    startTime: formatDate(req.body.startTime),
    endTime: formatDate(req.body.endTime),
    postedById: req.alumniId,
  };

  const new_internship = await prisma.internship.create({
    data: internshipData,
  });

  return res.status(201).json({
    message: "Internship posted successfully",
    new_internship,
  });
};

const getPostedInternships = async (req, res) => {
  const alumniId = req.alumniId;

  const user = await prisma.alumni.findUnique({
    where: { id: alumniId },
  });

  const internships = await prisma.internship.findMany({
    where: { postedById: alumniId },
  });

  return res.status(200).json({ internships });
};

const getAllApplications = async (req, res) => {
  const internshipId = parseInt(req.params.id);

  const appliedStudents = await prisma.internApplication.findMany({
    where: {
      internshipId: internshipId,
    },
    include: {
      student: {
        include: {
          experiences: true,
        },
      },
    },
  });

  return res.status(201).json({ appliedStudents });
};

const acceptStudent = async (req, res) => {
  const internshipId = parseInt(req.params.id);
  const studentId = parseInt(req.body.studentId);

  const applications = await prisma.internApplication.update({
    where: {
      studentId_internshipId: {
        studentId: studentId,
        internshipId: internshipId,
      },
    },
    data: {
      status: "ACCEPTED",
    },
  });
  

  return res
    .status(201)
    .json({
      message:
        "Successfully accepted the student's application for this internship",
    });
};

const rejectStudent = async (req, res) => {
  const internshipId = parseInt(req.params.id);
  const studentId = req.body.studentId;

  const applications = await prisma.internApplication.update({
    where: {
      studentId_internshipId: {
        studentId: studentId,
        internshipId: internshipId,
      },
    },
    data: {
      status: "REJECTED",
    },
  });

  return res
    .status(201)
    .json({
      message: "successfully rejected the student for this internship.",
    });
};

const closeInternship = async (req, res) => {
  try {
    const internshipId = parseInt(req.params.id);
    const alumniId = req.alumniId;

    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
    });

    if (!internship)
      return res.status(404).json({ message: "Internship not found" });

    if (internship.postedById !== alumniId) {
      return res.status(403).json({
        message: "You are not authorized to close this internship",
      });
    }

    await prisma.internship.update({
      where: { id: internship.id },
      data: { closed: true },
    });

    return res
      .status(200)
      .json({ message: "Internship closed successfully", internship });
  } catch (error) {
    console.error("Error closing internship:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const updateInternship = async (req, res) => {
  try {
    const internshipId = parseInt(req.params.id);
    const alumniId = req.alumniId;

    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
    });

    if (!internship)
      return res.status(404).json({ message: "Internship not found" });

    if (internship.postedById !== alumniId) {
      return res.status(403).json({
        message: "You are not authorized to update this internship",
      });
    }

    const internshipData = {
      ...req.body,
      domain: req.body.domain.toUpperCase(),
      startTime: formatDate(req.body.startTime),
      endTime: formatDate(req.body.endTime),
      postedById: alumniId,
    };

    await prisma.internship.update({
      where: { id: internshipId },
      data: internshipData,
    });

    return res.status(200).json({ message: "Internship updated successfully" });
  } catch (error) {
    console.error("Error updating internship:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getMentorshipsForMentor = async (req, res) => {
  try {
    const mentorId = req.mentorId;

    const mentorships = await prisma.mentorship.findMany({
      where: { mentorId },  // Added filter for current mentor
      include: {
        mentee: {
          include: {
            student: {
              include: {
                experiences: {
                  select: {
                    title: true,
                    startDate: true,
                    endDate: true,
                    description: true,
                    techStacks: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!mentorships.length) {
      return res.status(404).json({ message: "No mentorships found" });
    }

    // Transform data to match desired format
    const formatted = mentorships.map(mentorship => ({
      id:mentorship.id,
      fullName: mentorship.mentee.student.fullName,
      rollno: mentorship.mentee.student.rollno,
      department: mentorship.mentee.student.department,
      cgpa: mentorship.mentee.student.cgpa.toString(),
      domain: mentorship.mentee.student.domain,
      cv: mentorship.mentee.student.cv,
      experiences: mentorship.mentee.student.experiences.map(exp => ({
        title: exp.title,
        company: exp.title, // Company not available in schema - using title as fallback
        startDate: exp.startDate.toISOString().split('T')[0],
        endDate: exp.endDate?.toISOString().split('T')[0] || null,
        description: exp.description,
        techStacks: exp.techStacks
      })),
      status: mentorship.status
    }));

    return res.status(200).json({
      message: "Mentorships fetched successfully",
      mentorships: formatted
    });

  } catch (error) {
    console.error("Error fetching mentorships:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const acceptMentorship = async (req, res) => {
  try {
    const { mentorshipId } = req.body;
    const mentorship = await prisma.mentorship.findUnique({
      where: { id: mentorshipId },
      include: { mentor: true },
    });

    if (!mentorship) {
      return res.status(404).json({ message: "Mentorship request not found" });
    }

    if (mentorship.status !== "PENDING") {
      return res
        .status(400)
        .json({ message: "Mentorship is not in a pending state" });
    }

    if (mentorship.mentor.currentMentees >= mentorship.mentor.maxMentees) {
      return res
        .status(400)
        .json({
          message: "This mentor has reached their maximum mentee limit",
        });
    }

    const updatedMentorship = await prisma.mentorship.update({
      where: { id: mentorshipId },
      data: {
        status: "ACTIVE",
        mentor: {
          update: {
            currentMentees: { increment: 1 },
          },
        },
      },
    });

    return res.status(200).json({
      message: "Mentorship request accepted successfully",
      mentorship: updatedMentorship,
    });
  } catch (error) {
    console.error("Error accepting mentorship:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const sendMentorStatus = async (req, res) => {
  if (req.mentorId) {
    res.status(200).json({
      isMentor: true,
    });
  } else {
    res.status(200).json({
      isMentor: false,
    });
  }
};
const addMentorProfile = async (req, res) => {
  try {
    // Combine userId from token and body data
    const payload = {
      ...req.body,
      userId: req.user.id // assuming authenticationToken middleware sets req.user
    };

    // Validate with Zod
    const validatedData = MentorSchema.parse(payload);

    // Save to DB (example: using Prisma)
    const mentor = await db.mentor.create({
      data: validatedData
    });

    res.status(201).json({ message: "Mentor profile created successfully", mentor });
  } catch (error) {
    console.error(error);
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const updateMentorProfile = async (req, res) => {
  try {
    // req.user is set by authenticationToken middleware
    const alumniId = req.user.id;

    // Validate data against Zod schema
    const parsedData = MentorSchema.parse({
      ...req.body,
      userId: alumniId
    });

    // Find alumni
    let alumni = await Alumni.findById(alumniId);
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    // Attach mentor profile to alumni
    alumni.mentorProfile = parsedData;
    await alumni.save();

    res.status(200).json({
      message: "Mentor profile saved successfully",
      mentorProfile: alumni.mentorProfile
    });
  } catch (error) {
    console.error("Error in setMentorProfile:", error);

    if (error.name === "ZodError") {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    }

    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  postInternship,
  getAllApplications,
  acceptStudent,
  rejectStudent,
  closeInternship,
  updateInternship,
  getPostedInternships,
  getMentorshipsForMentor,
  acceptMentorship,
  sendMentorStatus,
  addMentorProfile, 
  updateMentorProfile
};
