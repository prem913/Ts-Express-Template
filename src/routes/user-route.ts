import { Router } from "express";
import {
    signUp,
    signIn,
    getUser,
    refreshToken,
    // getUserDetails
} from "../controllers/user-controller";
import authenticateUser from "../middlewares/auth";

const router = Router();

router.post("/signup",signUp);
router.post("/signin",signIn);
router.get("/",authenticateUser,getUser);
router.get("/refresh",refreshToken);
// router.get("/getuserdetails",authenticateUser,getUserDetails)


export default router;