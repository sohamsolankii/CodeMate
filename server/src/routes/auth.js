require("dotenv").config()

const express = require("express")
const authRouter = express.Router()

const { validateSignUpData } = require("../utils/validation")
const User = require("../models/user")
const bcrypt = require("bcrypt")

// Convert COOKIE_EXPIRATION to milliseconds safely (default: 8 hours)
const COOKIE_EXPIRATION_MS =
	parseInt(process.env.COOKIE_EXPIRATION || "8", 10) * 60 * 60 * 1000

authRouter.post("/signup", async (req, res) => {
	try {
		// Validate request body
		validateSignUpData(req)

		const { firstName, lastName, emailId, password, photoUrl, about } =
			req.body

		// Check for existing user
		const existingUser = await User.findOne({ emailId })
		if (existingUser) {
			throw new Error("Email already registered")
		}

		// Encrypt the password
		const passwordHash = await bcrypt.hash(password, 10)

		// Create and save user
		const user = new User({
			firstName,
			lastName,
			emailId,
			password: passwordHash,
			photoUrl,
			about,
		})

		const savedUser = await user.save()
		const token = await savedUser.getJWT()

		// Set auth cookie
		res.cookie("token", token, {
			expires: new Date(Date.now() + COOKIE_EXPIRATION_MS),
			httpOnly: true,
			sameSite: "Strict", // optional for security
		})

		res.json({ message: "User added successfully!", data: savedUser })
	} catch (err) {
		res.status(400).send("ERROR : " + err.message)
	}
})

authRouter.post("/login", async (req, res) => {
	try {
		const { emailId, password } = req.body

		const user = await User.findOne({ emailId })
		if (!user) {
			throw new Error("Invalid credentials")
		}

		const isPasswordValid = await user.validatePassword(password)
		if (!isPasswordValid) {
			throw new Error("Invalid credentials")
		}

		const token = await user.getJWT()

		res.cookie("token", token, {
			expires: new Date(Date.now() + COOKIE_EXPIRATION_MS),
			httpOnly: true,
			sameSite: "Strict",
		})

		res.send(user)
	} catch (err) {
		res.status(400).send("ERROR : " + err.message)
	}
})

authRouter.post("/logout", (req, res) => {
	res.cookie("token", null, {
		expires: new Date(0),
		httpOnly: true,
		sameSite: "Strict",
	}).send("Logout Successful!!")
})

module.exports = authRouter
