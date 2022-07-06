import mongoose from "mongoose";

import { MONGODB_URI } from "@/utils/constants";

mongoose.connect(`${MONGODB_URI}/example-api`, {
    // @ts-ignore
    useNewUrlParser: true,
});
