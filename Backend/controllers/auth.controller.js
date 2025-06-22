import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import generateToken from "../utils/token.js";
import cloudinary from "../utils/cloudinary.js";
import geminiResponse from "../gemini.js";

export const Signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        const token = generateToken(user._id)
        res.cookie('token', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
        });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: `error creating user: ${error.message}` });
    }

}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        const token = generateToken(user._id)
        res.cookie('token', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
        });
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });


    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: `error logging in: ${error.message}` });

    }
}

export const Logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: `error logging out: ${error.message}` });
    }
}

export const Check_Auth = async (req, res) => {
    try {
        res.status(200).json(req.user);

    } catch (error) {
        console.error('Check_Auth error:', error);
        res.status(500).json("Internal Server Error")
    }
}

export const Update_Assistant = async (req, res) => {
    try {
        const { imageUrl, assistantName } = req.body
        let assistantImage;
        if (req.file) {
            const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
            const result = await cloudinary.uploader.upload(base64Image, {
                folder: "assistant_images",
            });
            assistantImage = result.secure_url;
        } else {
            assistantImage = imageUrl
        }

        const user = await User.findByIdAndUpdate(req.user._id, {
            assistantName: assistantName,
            assistantImage: assistantImage
        }, { new: true }).select("-password")
        res.status(200).json(user);

    } catch (error) {
        console.error('Update_Assistant error:', error);
        res.status(500).json({ message: `error updating assistant: ${error.message}` });

    }
}

export const askAssistant = async (req, res) => {
    try {
        const { command } = req.body;
        console.log(command);
        const user = await User.findById(req.user._id);
        user.history.push(command);
        await user.save();
        const userName = user.name
        const assistantName = user.assistantName;
        const result = await geminiResponse(command, assistantName, userName);
        if (!result || typeof result !== "string") {
            return res.status(400).json({ message: "Assistant response was empty or invalid." });
        }
        console.log("Raw Gemini response:", result);
        const jsonMatch = result.match(/{[\s\S]*}/);
        if (!jsonMatch) {
            return res.status(400).json({ message: "Sorry I can't understand , please try again." });
        }
        const geminiResult = JSON.parse(jsonMatch[0]);
        const type = geminiResult.type;
        const directPlay = geminiResult.directPlay || false;

        switch (type) {
            case 'get_date':
                return res.json({
                    type,
                    userInput: geminiResult.userinput,
                    result: new Date().toLocaleDateString()
                });
            case 'get_time':
                return res.json({
                    type,
                    userInput: geminiResult.userinput,
                    result: new Date().toLocaleTimeString()
                });
            case 'get_day':
                return res.json({
                    type,
                    userInput: geminiResult.userinput,
                    result: new Date().toLocaleDateString('en-US', { weekday: 'long' })
                });
            case 'get_month':
                return res.json({
                    type,
                    userInput: geminiResult.userinput,
                    result: new Date().toLocaleDateString('en-US', { month: 'long' })
                })
            case 'youtube_play':
                return res.json({
                    type,
                    userInput: geminiResult.userinput,
                    result: geminiResult.response,
                    directPlay
                });
            case 'general':
            case 'google_search':
            case 'youtube_search':
            case 'get_battery':
            case 'get_location':
            case 'screenshot':
            case 'copy_to_clipboard':
            case 'calculator_open':
            case 'instagram_open':
            case 'facebook_open':
            case 'weather_show':
                return res.json({
                    type,
                    userInput: geminiResult.userinput,
                    result: geminiResult.response
                });
            default:
                return res.status(400).json({ message: "Sorry I can't understand, please try again." });

        }


    } catch (error) {
        console.error('askAssistant error:', error);
        res.status(500).json({ message: `error asking assistant: ${error.message}` });

    }
}
