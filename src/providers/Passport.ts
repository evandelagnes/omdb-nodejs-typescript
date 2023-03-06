import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { BadRequestException } from "@exceptions";
import { UserService } from "@services";
import { Bcrypt } from "@providers";

class Passport {
    public localStrategy() {
        passport.use(
            new LocalStrategy(
                {
                    usernameField: "email",
                    passwordField: "password",
                    passReqToCallback: true,
                },
                async (req, email, password, done) => {
                    try {
                        const user = await UserService.getByEmail(email);
                        if (!user)
                            return done(
                                new BadRequestException(
                                    "Incorrect email address or password.",
                                ),
                                false,
                            );

                        if (await Bcrypt.compare(password, user.password))
                            return done(null, {
                                id: user.id,
                                email: user.email,
                            });
                        return done(
                            new BadRequestException(
                                "Incorrect email address or password.",
                            ),
                            false,
                        );
                    } catch (err) {
                        done(err, false);
                    }
                },
            ),
        );
    }

    public serialize() {
        passport.serializeUser((user: Express.User, cb) => {
            process.nextTick(function () {
                return cb(null, user);
            });
        });
    }

    public deserialize() {
        passport.deserializeUser((user: Express.User, cb) => {
            process.nextTick(function () {
                return cb(null, user);
            });
        });
    }
}

export default new Passport();
