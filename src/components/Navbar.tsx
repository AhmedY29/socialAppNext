import Link from "next/link"
import DesktopNavbarComponent from "./DesktopNavbar"
import MobileNavbarComponent from "./MobileNavbar"

const NavbarComponent = () => {
  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <Link href="/" className="text-lg font-bold text-primary font-mono tracking-wider">
                        Social App
                    </Link>
                </div>

                {/* Desc Nav */}
                <DesktopNavbarComponent />
                {/* Mobile Nav */}
                <MobileNavbarComponent />
            </div>
        </div>
    </nav>
  )
}

export default NavbarComponent