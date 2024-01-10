import type { Request, Response, NextFunction } from "express"
import { createClient } from "redis"
import config from "../config.js"

const { REDIS_URL } = config;

export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Check if sessionID exists
    const cookie: string = req.cookies.sessionID
    if (!cookie) return res.sendStatus(401)

    // Connect to redis
    const client = createClient({ url: REDIS_URL })
    client.on("error", () => res.sendStatus(500))
    await client.connect()

    // Check if the cookie is valid
    const cookieResponse = await client.get(cookie)
    if (!cookieResponse) return res.status(401).send("Invalid cookie")

    next()
}
