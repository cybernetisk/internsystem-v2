import {toNextJsHandler} from "better-auth/next-js";
import {auth} from "@/app/api/utils/auth";

export const {POST, GET} = toNextJsHandler(auth);