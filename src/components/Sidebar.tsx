import { currentUser } from "@clerk/nextjs/server"
import { Card, CardContent, CardHeader } from "./ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { getUserByClerkId } from "@/actions/user.action";
import { LinkIcon, MapPin } from "lucide-react";
import Link from "next/link";

const SidebarComponent = async () => {

    const user = await currentUser();
    if(!user) return <UnAuthenticatedSidebar />
    const userData = await getUserByClerkId(user.id)
    if(!userData) return null
  return (
    <Card className="sticky top-20 p-6 text-center">
        <Link href={`/profile/${userData.username}`} className="information flex flex-col items-center justify-center gap-2">
            <Image 
            src={userData?.image ?? "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"}
            alt={`${userData?.name}_Avatar`}
            width={80}
            height={80}
            className="rounded-full"
             />
            <div>
                <h4 className="font-medium">{userData?.name}</h4>
                <h6 className="text-muted-foreground text-sm">{userData?.username}</h6>
            </div>
            {userData?.bio && <p className="text-muted-foreground text-sm">{userData?.bio}</p>}
        </Link>
         <Separator className="my-2" />
         <div className="flex justify-between">
            <div>
                <p className="font-medium">{userData?._count.following}</p>
                <p className="text-xs text-muted-foreground">Following</p>
            </div>
            <div>
                <p className="font-medium">{userData?._count.followers}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
            </div>
         </div>
         <Separator className="my-2" />
         <div className="text-muted-foreground text-sm w-full space-y-2">
            <div className="flex items-center gap-3 ">
                <MapPin className="w-4 h-4" />
                <h6>{userData?.location || "No location"}</h6>
            </div>
            <div className="flex items-center gap-3 ">
                <LinkIcon className="w-4 h-4" />
            {userData?.website ? 
                (
                    <a href={userData.website} className="hover:underline truncate" target="_blank"/>
                ) :
                "No website"
            }
                
            </div>
         </div>
    </Card>
  )
}

export default SidebarComponent

const UnAuthenticatedSidebar = () =>  (
    <Card className="sticky top-20">
        <CardHeader>Welcome Back!</CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground mb-4">
                Login to access your profile and connect with others.
            </p>

            <SignInButton mode="modal">
                <Button className="w-full" variant='outline'>
                    Login
                </Button>
            </SignInButton>
            <SignUpButton mode="modal">
                <Button className="w-full mt-2" variant='default'>
                    Sign Up
                </Button>
            </SignUpButton>
        </CardContent>
    </Card>
  )

