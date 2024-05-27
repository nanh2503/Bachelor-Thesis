import { ReactNode, useEffect, useState } from "react";
import { Zoom } from "@mui/material";
import { styled } from "@mui/material/styles";

interface ScrollToBottomProps {
    className?: string;
    children: ReactNode
}

const ScrollToBottomStyled = styled('div')(({ theme }) => ({
    zIndex: 11,
    position: 'fixed',
    right: theme.spacing(6),
    bottom: theme.spacing(5)
}))

const ScrollToBottom = (props: ScrollToBottomProps) => {
    const { children, className } = props;
    const [trigger, setTrigger] = useState(false);

    const checkScrollPosition = () => {
        const scrollPosition = window.innerHeight + window.scrollY;
        const threshold = document.body.offsetHeight - 400;
        setTrigger(scrollPosition < threshold);
    }

    useEffect(() => {
        window.addEventListener('scroll', checkScrollPosition);

        return () => window.removeEventListener('scroll', checkScrollPosition);
    }, [])

    const handleClick = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    return (
        <Zoom in={trigger}>
            <ScrollToBottomStyled className={className} onClick={handleClick} role="presentation">
                {children}
            </ScrollToBottomStyled>
        </Zoom>
    )
}

export default ScrollToBottom;