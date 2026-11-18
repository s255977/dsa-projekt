import bcrypt from "bcryptjs";

const password = "hemmelig123";
const hash = await bcrypt.hash(password, 10);

console.log(hash);
