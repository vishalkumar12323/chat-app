import { Request, Response } from "express"
import bcrypt from 'bcrypt';
import { signToken } from "../utils/jwt"
import { User } from '../models';
import { UserAttributes } from '../models/User';


const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password_hash,
        });

        const attrs = newUser.get() as UserAttributes;
        const token = signToken({ userId: attrs.id });

        res.status(201).json({
            token,
            user: {
                id: attrs.id,
                username: attrs.username,
                email: attrs.email,
                avatar_url: attrs.avatar_url,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const attrs = user.get() as UserAttributes;
        const isMatch = await bcrypt.compare(password, attrs.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = signToken({ userId: attrs.id });

        res.json({
            token,
            user: {
                id: attrs.id,
                username: attrs.username,
                email: attrs.email,
                avatar_url: attrs.avatar_url,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMe = async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk(req.user?.userId, {
            attributes: { exclude: ['password_hash'] },
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export { register, login, getMe };
