import { currentUser } from "@clerk/nextjs/server"
import ToggleMode from "./ToggleMode";
import { Button } from "./ui/button";
import Link from "next/link";
import { BellIcon, HomeIcon, UserIcon } from "lucide-react";
import { SignInButton, UserButton } from "@clerk/nextjs";

const DesktopNavbarComponent = async () => {
  const user = await currentUser();
  return (
    <div className="hidden md:flex items-center space-x-4">
      <ToggleMode />
      <Button variant='ghost' className="flex items-center gap-2" asChild>
        <Link href='/'>
          <HomeIcon />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      {user ? (
        <>

        <Button variant='ghost' className="flex items-center gap-2" asChild>
          <Link href='/notifications'>
            <BellIcon />
            <span className="hidden lg:inline">Notifications</span>
          </Link>
        </Button>

        <Button variant='ghost' className="flex items-center gap-2" asChild>
          <Link href={`/profile/${user.username ?? user.emailAddresses[0].emailAddress.split('@')[0]}`}>
            <UserIcon />
            <span className="hidden lg:inline">Profile</span>
          </Link>
        </Button>
        <UserButton />
        </>
      ): (
        <SignInButton mode="modal">
          <Button variant='default'>
            Sign In
          </Button>
        </SignInButton>
      )}
    </div>
  )
}

export default DesktopNavbarComponent