import type { Context } from "hono";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const signUp = async (c: Context) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      age,
      isAdmin,
      longitude,
      latitude,
      interests,
    } = await c.req.json();
    if (!email) {
      return c.json(
        {
          msg: "Email is required",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return c.json("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        age,
        phone,
        isAdmin,
        longitude,
        latitude,
        interests,
      },
    });

    const tokens = generateTokens(user.id);

    return c.json({
      msg: "User created",
      user: {
        name: user.name,
        email: user.email,
      },
      tokens,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ msg: "Internal server error" }, 500);
  }
};

export const login = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json(
        {
          msg: "Email and passowrd are required",
        },
        400
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return c.json(
        {
          msg: "User doesn't exist",
        },
        400
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return c.json(
        {
          msg: "Invalid creds",
        },
        400
      );
    }

    const tokens = generateTokens(existingUser.id);

    return c.json({
      msg: "Login sucessfull",
      user: {
        name: existingUser.name,
        email: existingUser.email,
      },
      tokens,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ msg: "Internal server error" }, 500);
  }
};

export const refreshToken = async (c: Context) => {
  try {
    const refresh = await c.req.json();
    if (!refresh) {
      return c.json({ msg: "No refresh token provided" }, 401);
    }

    const payload = (await jwt.verify(refresh, JWT_REFRESH_SECRET)) as {
      userId: string;
    };
    const tokens = generateTokens(payload.userId);

    return c.json({
      tokens,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ msg: "Internal server error" }, 500);
  }
};

export const logout = (c: Context) => {
  return c.json({
    msg: "Logout succesfull",
  });
};
