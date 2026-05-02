import { Typography } from "@material-tailwind/react";
import imgLogo from "../../../assets/img/logoExpress.png"
import { ThemeToggleButton } from "../../../shared/components/ui/ThemeToggleButton.jsx";
import { AvatarUser } from '../ui/AvatarUser';

export const Navbar = () => {
    return (
        <nav className=" shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img
                        src={imgLogo}
                        alt="Express"
                        className="h-8 md:h-10 w-auto object-contain"
                    />
                    <Typography variant="h5" className="font-bold text-main-blue">
                        Express
                    </Typography>
                </div>
                <ThemeToggleButton />
                <AvatarUser />
            </div>
        </nav>
    )
}