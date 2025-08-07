require('dotenv').config({path:'../.env'});
const prisma=require("../utils/prismaClient")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const axios = require('axios');

// existing schema (updated for the new requirements)
const signUp_signIn_Schema = z.object({
  username: z.string().min(1, { message: "Username cannot be empty!" }).optional(),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z.string().min(1, { message: "Password cannot be empty!" }),
  role: z.enum(["STUDENT", "ALUMNI"]).optional()
});

// Extended schema for signup with role-specific data
const signUpExtendedSchema = z.object({
  username: z.string().min(1, { message: "Username cannot be empty!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z.string().min(1, { message: "Password cannot be empty!" }),
  role: z.enum(["STUDENT", "ALUMNI"]),
  
  // Student specific data
  studentData: z.object({
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters!" }),
    cgpa: z.number().min(0).max(10, { message: "CGPA must be between 0 and 10!" }),
    cv: z.string().url({ message: "CV must be a valid URL!" }),
    department: z.string().min(2, { message: "Department must be at least 2 characters!" }),
    rollno: z.string().min(1, { message: "Roll number is required!" }),
    domain: z.enum([
      "SOFTWARE", "FRONTEND", "BACKEND", "PRODUCT_MANAGEMENT", "WEB_DEVELOPMENT", 
      "MOBILE_DEVELOPMENT", "MACHINE_LEARNING", "DATA_SCIENCE", "BLOCKCHAIN", 
      "CLOUD_COMPUTING", "CYBERSECURITY", "BUSINESS_MANAGEMENT", "FINANCE", 
      "ACCOUNTING", "HUMAN_RESOURCES", "MARKETING", "SALES", "OPERATIONS", 
      "STRATEGY", "PROJECT_MANAGEMENT", "SUPPLY_CHAIN_MANAGEMENT", "CONSULTING", 
      "ENTREPRENEURSHIP", "BUSINESS_DEVELOPMENT", "BUSINESS_ANALYTICS", 
      "ECONOMICS", "PUBLIC_RELATIONS"
    ])
  }).optional(),
  
  // Alumni specific data
  alumniData: z.object({
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters!" }),
    presentCompany: z.string().min(2, { message: "Company name must be at least 2 characters!" }),
    yearsOfExperience: z.number().min(0, { message: "Years of experience must be non-negative!" }),
    domain: z.enum([
      "SOFTWARE", "FRONTEND", "BACKEND", "PRODUCT_MANAGEMENT", "WEB_DEVELOPMENT", 
      "MOBILE_DEVELOPMENT", "MACHINE_LEARNING", "DATA_SCIENCE", "BLOCKCHAIN", 
      "CLOUD_COMPUTING", "CYBERSECURITY", "BUSINESS_MANAGEMENT", "FINANCE", 
      "ACCOUNTING", "HUMAN_RESOURCES", "MARKETING", "SALES", "OPERATIONS", 
      "STRATEGY", "PROJECT_MANAGEMENT", "SUPPLY_CHAIN_MANAGEMENT", "CONSULTING", 
      "ENTREPRENEURSHIP", "BUSINESS_DEVELOPMENT", "BUSINESS_ANALYTICS", 
      "ECONOMICS", "PUBLIC_RELATIONS"
    ])
  }).optional()
}).refine((data) => {
  // Ensure student data is provided for students
  if (data.role === 'STUDENT') {
    return data.studentData !== undefined;
  }
  // Ensure alumni data is provided for alumni  
  if (data.role === 'ALUMNI') {
    return data.alumniData !== undefined;
  }
  return true;
}, {
  message: "Role-specific data is required"
});
const signupUser = async (req, res) => {
  try {
    const { username, email, password, role, studentData, alumniData } = req.body;

    // Basic validation
    if (!username || !email || !password || !role) {
      return res.status(400).json({ 
        message: "Username, email, password, and role are required" 
      });
    }

    // Role-specific validation
    if (role === "STUDENT" && !studentData) {
      return res.status(400).json({ 
        message: "Student data is required for student registration" 
      });
    }

    if (role === "ALUMNI" && !alumniData) {
      return res.status(400).json({ 
        message: "Alumni data is required for alumni registration" 
      });
    }

    // Check if the user already exists
    const userExist = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (userExist) {
      return res.status(401).json({ 
        message: "User already exists with provided email Id" 
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      // Create user
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role
        },
      });

      // Create role-specific profile
      if (role === "STUDENT") {
        await prisma.student.create({
          data: {
            userId: user.id,
            fullName: studentData.fullName,
            cgpa: studentData.cgpa,
            cv: studentData.cv,
            department: studentData.department,
            rollno: studentData.rollno,
            domain: studentData.domain
          }
        });
      } else if (role === "ALUMNI") {
        await prisma.alumni.create({
          data: {
            userId: user.id,
            fullName: alumniData.fullName,
            presentCompany: alumniData.presentCompany,
            yearsOfExperience: alumniData.yearsOfExperience,
            domain: alumniData.domain
          }
        });
      }

      return user;
    });

    // Generate JWT token
    const token = jwt.sign({ userId: result.id }, process.env.JWT_SECRET);

    return res.status(201).json({ 
      message: "User created successfully!", 
      token,
      user: {
        id: result.id,
        username: result.username,
        email: result.email,
        role: result.role
      }
    });

  } catch (error) {
    console.error("Error during sign-up:", error);
    
    // Handle Prisma errors
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        message: "Email or username already exists" 
      });
    }
    
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        message: "Invalid foreign key constraint" 
      });
    }

    res.status(500).json({ 
      message: "Internal server error.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Sign-in User Function
const signinUser = async (req, res) => {
  try {
    // Use the original schema for signin (only email, password needed)
    const validatedData = signUp_signIn_Schema.parse(req.body);
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: validatedData.email
      },
      include: {
        student: true,
        alumni: true
      }
    });

    if (!user) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.role === 'STUDENT' ? user.student : user.alumni
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation failed.", 
        errors: error.errors 
      });
    }
    
    console.error("Error during sign-in:", error);
    res.status(500).json({ 
      message: "Internal server error." 
    });
  }
};

/////////////////////For linkedIn
// LinkedIn OAuth 2.0 credentials from environment variables
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI || "http://localhost:8000/api/auth/linkedin/callback";

// console.log(LINKEDIN_CLIENT_ID);
// console.log(LINKEDIN_CLIENT_SECRET);
// console.log(LINKEDIN_REDIRECT_URI);


const linkedinSignin = (req, res) => {
  const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}&scope=openid%20profile%20email&state=12345`;
  // console.log('Authorization URL:', authorizationUrl);
  res.redirect(authorizationUrl);
};

const linkedinCallback = async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
      console.error('Authorization code is missing.');
      return res.status(400).send('Authorization code is missing.');
  }

  try {
    console.log("🔹 Received auth code:", code);

      // Exchange authorization code for an access token
      const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
          params: {
              grant_type: 'authorization_code',
              code,
              redirect_uri: LINKEDIN_REDIRECT_URI,
              client_id: LINKEDIN_CLIENT_ID,
              client_secret: LINKEDIN_CLIENT_SECRET,
          },
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
      });
      console.log("✅ Token Response:", tokenResponse.data);
      const accessToken = tokenResponse.data.access_token;

      // Using access token to fetch user data
      const userInfoResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
      });

      const userInfo = userInfoResponse.data;

      // if user already exists in database
      let user = await prisma.user.findUnique({
          where: { email: userInfo.email },
      });

      // If user does not exist, create a new one
      if (!user) {      
          user = await prisma.user.create({
              data: {
                  username: userInfo.name,
                  email: userInfo.email,
                  password: null,  // No password needed for OAuth users
              },
          });
      }

      
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

      return res.status(200).json({
          message: "LinkedIn sign-in successful.",
          token,
      });

  } catch (error) {
      console.error('Error during OAuth process:', error.response ? error.response.data : error.message);
      res.status(500).send('Authentication failed.');
  }
};



module.exports = { signinUser,signupUser,linkedinSignin,linkedinCallback };
