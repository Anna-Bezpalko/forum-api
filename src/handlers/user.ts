import type { Request, Response } from "express"; 
import type { UserService } from "../services/user.js";

export function createUserHandlers(service: UserService) { 
    return { 
        async register(req: Request, res: Response) { 
            const { name, email, password } = req.body;
            if (
                typeof name !== "string" ||
                name.trim() === "" ||
                typeof email !== "string" ||
                email.trim() === "" ||
                typeof password !== "string" ||
                password.length < 6
            ) {
                return res.status(422).json({
                message: "Invalid registration data",
                });
            }

            try {
                const user = await service.register({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
                });

            return res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                });
        } catch (error) {
            if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
                return res.status(409).json({
                    message: "Email already exists",
                });
            }

            console.error(error);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    },

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

    if (
        typeof email !== "string" ||
        email.trim() === "" ||
        typeof password !== "string" ||
        password === ""
    ) {
        return res.status(422).json({
        message: "Invalid login data",
        });
    }

    try {
        const user = await service.login(
            email.trim().toLowerCase(),
            password,
        );
        const accessToken = service.createToken(user);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login successful",
        });
    } catch (error) {
        if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
},
}; 
}