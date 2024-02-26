import Auth from "../models/auth.js";
import Token from "../models/token.js";
import bcrypt from "bcryptjs";
import { signupSchema, signinSchema } from "../Schemas/auth.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import { senderMail } from "../utils/senderMail.js";

export const me = async (req, res) => {
    if (!req.session.userId) {
        return res.status(201).json(null);
    }

    const user = await Auth.findOne({ _id: req.session.userId });

    user.password = undefined;
    user.cardnumber = undefined;

    return res.status(200).json(user);
};

export const signup = async (req, res) => {
    try {
        const { error } = signupSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors,
            });
        }
        const authExist = await Auth.findOne({ email: req.body.email });
        if (authExist) {
            return res.status(400).json({
                message: "Email đã tồn tại",
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const auth = await Auth.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            images: req.body.images,
            avatar: req.body.avatar,
        });

        const token = jwt.sign({ id: auth._id }, "123456", { expiresIn: "7d" });
        auth.password = undefined;

        const hashToken = await bcrypt.hash(token, 10);

        const baseUrl = `http://localhost:5173/account/verify-email?token=${hashToken}&userId=${auth._id}`;

        let html = `
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
    
        <!-- start hero -->
        <tr>
          <td align="center" bgcolor="#e9ecef">
            <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
            <td align="center" valign="top" width="600">
            <![endif]-->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                  <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Xác nhận địa chỉ email của bạn</h1>
                </td>
              </tr>
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
        <!-- end hero -->
    
        <!-- start copy block -->
        <tr>
          <td align="center" bgcolor="#e9ecef">
            <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
            <td align="center" valign="top" width="600">
            <![endif]-->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <!-- start button -->
              <tr>
                <td align="left" bgcolor="#ffffff">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" bgcolor="#1a82e2" style="border-radius: 2px;">
                              <a href="${baseUrl}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Xác nhận Email</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- end button -->
    
              
    
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
        <!-- end copy block -->
    
        
    
      </table>
      <!-- end body -->
        `

        await senderMail(auth.email, html)

        return res.status(201).json({
            message: "Tạo tài khoản thành công",
            accessToken: token,
            auth,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await Auth.findOne({ _id: userId });

        if (!user) return res.status(403).json({ message: "Không tìm thấy người dùng" })

        await Auth.findByIdAndUpdate({ _id: userId }, { active: true }, { new: true });

        return res.status(200).json({ message: "Đã kích hoạt tài khoản thành công" })

    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
}

const maxLoginAttempts = 3;
// const baseLockoutDuration = 5 *60* 1000; // 5 phút

const baseLockoutDuration = 5 * 1000; // 5 s để test cho nhanh

export const signin = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;
        const { error } = signinSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                message: error.details.map((err) => err.message),
            });
        }

        const auth = await Auth.findOne(
            usernameOrEmail.includes("@")
                ? { email: usernameOrEmail }
                : { username: usernameOrEmail }
        );

        if (!auth) {
            return res.status(400).json({
                message: usernameOrEmail.includes("@")
                    ? "Email không tồn tại"
                    : "Tên người dùng không đúng",
            });
        }

        if (!auth.active) {
            return res.status(401).json({ message: "Tài khoản chưa được kích hoạt, vui lòng kiểm tra email của bạn" })
        }

        const attemptsLeft = maxLoginAttempts - (auth.loginAttempts || 0);

        // Kiểm tra thời gian khóa
        if (auth.lockedUntil && auth.lockedUntil > new Date()) {
            const remainingTime = Math.ceil((auth.lockedUntil - new Date()) / 1000);

            return res.status(403).json({
                message: `Tài khoản đã bị khóa do bạn đã nhập sai nhiều lần. Vui lòng thử lại sau ${remainingTime} giây.`,
                attemptsLeft: 0,
                lockedUntil: auth.lockedUntil,
            });
        }

        const isMatch = await bcrypt.compare(password, auth.password);

        if (!isMatch) {
            auth.loginAttempts = (auth.loginAttempts || 0) + 1;

            if (auth.loginAttempts >= maxLoginAttempts) {
                const timeSinceLastAttempt = new Date() - auth.lastFailedAttempt;

                // Nếu đã nhập sai 5 lần và vẫn nhập sai sau thời gian khóa
                if (timeSinceLastAttempt >= baseLockoutDuration) {
                    auth.lockedUntil = new Date(Date.now() + baseLockoutDuration);
                } else {
                    const lockoutDuration = baseLockoutDuration * Math.pow(2, auth.loginAttempts - maxLoginAttempts);
                    auth.lockedUntil = new Date(Date.now() + lockoutDuration);
                }
            }

            auth.lastFailedAttempt = new Date();

            await auth.save();

            const attemptsLeft = maxLoginAttempts - auth.loginAttempts;

            return res.status(400).json({
                message: "Mật khẩu không đúng",
                attemptsLeft,
            });
        }

        // Đăng nhập thành công, reset số lần thử đăng nhập
        auth.loginAttempts = 0;
        auth.lastFailedAttempt = null;

        await auth.save();

        const token = jwt.sign({ id: auth._id }, "123456", { expiresIn: "1d" });

        res.cookie("accessToken", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        req.session.userId = auth.id;
        req.session.accessToken = token;

        return res.status(200).json({
            message: "Đăng nhập thành công",
            accessToken: token,
            auth,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};



export const logout = (req, res) => {
    return new Promise((resolve, _reject) => {
        res.clearCookie("accessToken");
        req.session.destroy((error) => {
            if (error) {
                console.log("SESSION_ERROR", error);
                resolve(false);
                return res.status(201).json(false)
            }
            resolve(true);
            return res.status(201).json(true)
        });
    });
};

export const forgotPassword = async (req, res) => {

    const { email } = req.body;




    try {
        const user = await Auth.findOne({ email })

        if (!user) return res.status(400).json({ message: 'Email này không tồn tại' });

        const randomPassword = Math.random().toString(36).slice(-8);

        let html = `
        <div style="text-align:center;">
            <h3 style="margin-bottom:2px;">Mật khẩu mới của bạn:</h3>
            <p style="font-size:18px;background-color: #333;color:#fff;padding: 6px 8px;">${randomPassword}</p>
        </div>
    `

        await senderMail(user.email, html);

        const hashPassword = await bcrypt.hash(randomPassword, 10);

        await user.updateOne({ password: hashPassword })

        return res.status(200).json({ message: "Gửi email thành công" })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export const changePassword = async (req, res) => {
    const { password, email } = req.body;

    try {
        const user = await Auth.findOne({ email })

        if (!user) return res.status(400).json({ message: "Người dùng không tồn tại" });

        const hashPassword = await bcrypt.hash(password, 10);

        await user.updateOne({ password: hashPassword });

        return res.status(200).json({ message: "Đổi mật khẩu thành công" })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}
