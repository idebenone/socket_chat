import { Router, Request, Response } from 'express';
import { Types } from 'mongoose';
import multer from 'multer';

import { validate } from "../middleware/token";
import User from '../models/User';
import Follower from "../models/Follower";
import response from "../utilities/response";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname + Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, originalName);
    }
});
const upload = multer({ storage: storage });

const user = Router();
user.use(validate);

user.post("/onboarding", async (req: Request, res: Response) => {
    const { username, bio } = req.body;
    if (!username || !bio) return res.status(422).json(response.MISSING);
    try {
        const user = await User.findByIdAndUpdate(
            res.locals.user_id, { username, bio }
        )
        return res.status(201).json(response.CREATED);
    } catch (error) {
        return res.status(501).json(response.SYSTEM_ERROR);
    }
})

user.get("/profile/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const user: any = await User.findOne({ _id: id }).select('-password -is_verified -otp -created_at -modified_at');
        if (user) return res.status(201).json(response.OK(user));
        return res.status(404).json(response.NOT_FOUND);
    } catch (error) {
        return res.status(501).json(response.SYSTEM_ERROR);
    }
})

user.post("/upload", upload.single('file'), async (req: Request, res: Response) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            res.locals.user_id,
            { profile_img: req.file ? req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename : undefined }
        ).exec();
        return res.status(201).json(response.CREATED);
    } catch (error) {
        return res.status(501).json(response.SYSTEM_ERROR);
    }
})

user.get("/follow/:id", async (req: Request, res: Response) => {
    const currentUserId = res.locals.user_id
    const userToFollowId = req.params.id;
    if (!currentUserId || !userToFollowId) return res.status(422).json(response.MISSING);
    try {
        if (currentUserId == userToFollowId) return res.status(400).json(response.UNABLE_TO_PROCESS);

        //GET USER DETAILS
        const currentUser = await User.findOne(new Types.ObjectId(currentUserId as string));
        const userToFollow = await User.findOne(new Types.ObjectId(userToFollowId));

        if (!currentUser || !userToFollow) return res.status(404).json(response.NOT_FOUND);
        const checkUserToFollow = await Follower.findOne({ user: new Types.ObjectId(currentUserId as string), follower: new Types.ObjectId(userToFollowId) })
        if (!checkUserToFollow) {
            //CREATE A FOLLOWER
            const follower = new Follower({ user: currentUserId, follower: new Types.ObjectId(userToFollowId) })
            //UPDATE THE COUNT
            await User.findByIdAndUpdate(currentUserId, { following_count: currentUser.following_count + 1 }).exec();
            await User.findByIdAndUpdate(new Types.ObjectId(userToFollowId), { followers_count: userToFollow.followers_count + 1 }).exec();

            return res.status(201).json(response.CREATED);
        }
        return res.status(422).json(response.UNABLE_TO_PROCESS);

    } catch (error) {
        return res.status(501).json(response.SYSTEM_ERROR);
    }
})

user.get("/unfollow/:id", async (req: Request, res: Response) => {
    const currentUserId = res.locals.user_id;
    const userToUnFollowId = req.params.id;
    if (!currentUserId || !userToUnFollowId) return res.status(422).json(response.MISSING);
    try {
        //GET USER DETAILS
        const currentUser = await User.findOne(currentUserId);
        const userToUnFollow = await User.findOne(new Types.ObjectId(userToUnFollowId));

        if (!currentUser || !userToUnFollow) return res.status(404).json(response.NOT_FOUND);

        await Follower.findOneAndDelete({ user: currentUserId, follower: new Types.ObjectId(userToUnFollowId) });

        //UPDATE THE COUNT
        await User.findByIdAndUpdate(currentUserId, { following_count: currentUser.following_count - 1 }).exec();
        await User.findByIdAndUpdate(new Types.ObjectId(userToUnFollowId), { followers_count: userToUnFollow.followers_count - 1 }).exec();
        return res.status(201).json(response.CREATED);
    } catch (error) {
        return res.status(501).json(response.SYSTEM_ERROR);
    }
})

user.get("/search", async (req: Request, res: Response) => {
    const { query } = req.query;
    try {
        if (typeof query !== 'string' || query.trim() === '') return res.status(400).json(response.MISSING);

        const users = await User.find({ username: { $regex: query, $options: 'i' } }).select('-password -otp -__v -is_verified');

        if (users.length === 0) return res.status(404).json(response.NOT_FOUND);
        return res.status(200).json(response.OK(users));
    } catch (error) {
        return res.status(500).json(response.SYSTEM_ERROR);
    }
});

export default user;

