import dotenv from "dotenv";
import { listen } from "./api/expressServer";

dotenv.config();

listen();
