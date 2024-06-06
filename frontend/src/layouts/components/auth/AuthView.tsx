import { useMemo, useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import themeConfig from "src/configs/themeConfig";
import ForgetPasswordForm from "../forget-password";

enum RenderViews {
    NONE,
    LOGIN,
    REGISTER,
    FORGET_PASSWORD
}

const AuthView = () => {
    const [view, setView] = useState(RenderViews.LOGIN);

    const slideTransform = useMemo(() => {
        switch (view) {
            case RenderViews.LOGIN:
                return 'translateX(-100%)';
            case RenderViews.REGISTER:
                return 'translateX(-200%)';
            case RenderViews.FORGET_PASSWORD:
                return 'translateX(0)';
            default:
                return 'translateX(-100%)';
        }
    }, [view]);

    return (
        <div id="auth-view" style={{ display: 'grid', gridTemplateColumns: "50% 50%" }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '90%' }}>
                <div>
                    <div style={{ fontWeight: 600, fontSize: '50px' }}>
                        Welcome to {themeConfig.templateName}! 👋🏻
                    </div>
                    <div style={{ marginTop: '10px', lineHeight: '40px', fontSize: '18px' }}>
                        Explore our user-friendly image storage and sharing service at <span style={{ fontWeight: '800', fontSize: '22px' }}>{themeConfig.templateName}</span>, helping you organize and manage your image collections efficiently
                    </div>
                </div>
            </div>
            <div style={{ maxWidth: '448px', overflow: 'hidden' }}>
                <div style={{
                    display: 'flex',
                    transform: slideTransform,
                    willChange: 'transform',
                    transition: '0.35s',
                }}>
                    <ForgetPasswordForm
                        onChangeViewLogin={() => {
                            setView(RenderViews.LOGIN);
                        }}
                    />
                    <LoginForm
                        onChangeViewRegister={() => {
                            setView(RenderViews.REGISTER);
                        }}
                        onClickForgotPassword={() => {
                            setView(RenderViews.FORGET_PASSWORD);
                        }}
                    />
                    <RegisterForm
                        onChangeViewLogin={() => {
                            setView(RenderViews.LOGIN);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AuthView;
