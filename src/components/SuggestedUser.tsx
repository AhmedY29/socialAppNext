import React from 'react'
import { Card, CardContent, CardHeader } from './ui/card'
import { getRandomUsers } from '@/actions/user.action'
import Link from 'next/link';
import Image from 'next/image';
import FollowButtonComponent from './FollowButton';

const SuggestedUser = async () => {
    const users = await getRandomUsers();
    if (users?.length == 0) return null
    return (
        <Card>
            <CardHeader>Suggested Users</CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {users?.map((user) => (
                        <div key={user.id} className="flex gap-2 items-center justify-between ">
                            <div className="flex items-center gap-3">
                                <Link href={`/profile/${user.username}`}>
                                    <Image
                                        src={user?.image ?? "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"}
                                        alt={`${user?.name}_Avatar`}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                </Link>
                                <div className="text-xs">
                                    <Link href={`/profile/${user.username}`} className="font-medium cursor-pointer">
                                        {user.name}
                                    </Link>
                                    <p className="text-muted-foreground">@{user.username}</p>
                                    <p className="text-muted-foreground">{user._count.followers} followers</p>
                                </div>
                            </div>
                            <FollowButtonComponent userId={user.id} />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default SuggestedUser