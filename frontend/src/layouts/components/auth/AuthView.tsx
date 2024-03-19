import { useMemo, useState } from "react"
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

enum RenderViews{
    NONE,
  LOGIN,
  REGISTER
}

const AuthView=()=>{
    const [view, setView]=useState(RenderViews.NONE);

    const slideTransform=useMemo(()=>{
        if(view===RenderViews.LOGIN){
            return 'translateX(0)'
        }else if(view===RenderViews.REGISTER){
            return 'translateX(-100%)'
        }
    },[view])

    return (
        <div id="auth-view" style={{display:'flex', justifyContent:'center'}}>
            <div style={{maxWidth:'448px', overflow:'hidden'}}>
                <div style={{
                    display:'flex',
                    transform:slideTransform,
                    willChange:'transform',
                    transition:'0.35s'
                }}>
                    <LoginForm
                        onChangeViewRegister={()=>{
                            setView(RenderViews.REGISTER)
                        }}
                    />
                    <RegisterForm
                        onChangeViewLogin={()=>{
                            setView(RenderViews.LOGIN)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default AuthView