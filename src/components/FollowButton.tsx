'use client'

import { toggleFollow } from "@/actions/user.action";
import { useState } from "react"
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";

const FollowButtonComponent = ({userId}: {userId: string}) => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleFollow = async () => {
        setLoading(true)
        try {
            await toggleFollow(userId)
            toast.success("User followed successfully");
        } catch (error) {
            toast.error('Error following user')
        } finally {
            setLoading(false)
        }
    }
  return (
    <Button variant='secondary' size='sm' onClick={handleFollow}>
        {loading ? <Loader2Icon className="size-4 animate-spin" /> : 'Follow'}
    </Button>
  )
}

export default FollowButtonComponent