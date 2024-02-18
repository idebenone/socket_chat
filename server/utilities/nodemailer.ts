import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    service: "email",
    auth: {
        user: "",
        pass: ""
    }
})