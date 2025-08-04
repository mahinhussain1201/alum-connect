require('dotenv').config({path:'../.env'});
const prisma=require("../utils/prismaClient")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const axios = require('axios');

// Zod Schema for sign-up Validation
const signUp_signIn_Schema = z.object({
  username: z.string().min(1, { message: "Username cannot be empty!" }).optional(),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z.string().min(1, { message: "Password cannot be empty!" }),
  role:z.enum(["STUDENT","ALUMNI"]).optional()
});



const signupUser = async (req, res) => {
  try {
    // Validate the request body wrt schema
    const validatedData = signUp_signIn_Schema.parse(req.body);
    
    // check if the user already exists
    const userExist= await prisma.user.findUnique({
      where:{
       email:validatedData.email
      }
    })

    if(userExist){
      return res.status(401).json({message:"User already exists with provided email Id"})
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword,
        role:validatedData.role
      },
    });

    const token=jwt.sign({userId:user.id},process.env.JWT_SECRET)

    return res.status(201).json({ message: "User created successfully!", token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation failed.", errors: error.errors });
    }
    console.error("Error during sign-up:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Sign-in User Function
const signinUser = async (req, res) => {
  console.log(req.body)
  try {
    if(!signUp_signIn_Schema.safeParse(req.body).success)
      return res.status(400).json({ message: "Zod Validation failed.", errors: error.errors })

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // If user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare the provided password with the hashed password in the database
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid Password." }); // Unauthorized error if passwords don't match
    }

    // Generate a JWT token with the user's ID and respond with status code 200
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    return res.status(200).json({
      message: "Sign-in successful.",
      token,
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ message: "Internal server error." });
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
