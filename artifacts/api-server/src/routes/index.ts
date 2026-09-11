import { Router, type IRouter } from "express";
import healthRouter from "./health";
import makanaRouter from "./makana";
import authRouter from "./auth";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(makanaRouter);
router.use(authRouter);
router.use(adminRouter);

export default router;
