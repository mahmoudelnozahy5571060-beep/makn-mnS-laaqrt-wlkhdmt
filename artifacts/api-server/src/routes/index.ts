import { Router, type IRouter } from "express";
import healthRouter from "./health";
import makanaRouter from "./makana";

const router: IRouter = Router();

router.use(healthRouter);
router.use(makanaRouter);

export default router;
