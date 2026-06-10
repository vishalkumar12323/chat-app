import { User } from '../models';
import { Request, Response } from "express"

const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'avatar_url', 'is_online', 'last_seen'],
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export {
    getUsers,
};
