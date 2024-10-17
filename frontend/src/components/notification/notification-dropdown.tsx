"use client"

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminNotifcation } from '@/types/notification/admin-notification';
import { UserNotification } from '@/types/notification/user-notification';
import { User } from '@/types/user';
import { useEffect, useState } from 'react';
import { Separator } from '../ui/separator';
import NotificationItem from './notification-item';
import { Bell, ShieldAlert } from 'lucide-react';
interface UserProps {
  user: User;
  token: string;
}

const NotificationDropdown = ({user, token}: UserProps) => {
    const [queueNotifications, setQueueNotifications] = useState<AdminNotifcation[]>([]);
    const [userNotifications, setUserNotifications] = useState<UserNotification[]>([]);

    useEffect(() => {
        const fetchRoleNotification = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/queue`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setQueueNotifications(data.reverse());
        }

        fetchRoleNotification();
    }, [token]);

  useEffect(() => {
      const fetchRoleNotification = async () => {
          const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/notifications/queue`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            setQueueNotifications(data.reverse());
        };

        fetchRoleNotification();

        const fetchUserNotification = async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            setUserNotifications(data.reverse());
        };

        fetchUserNotification();
    }, [token]);

    return (
        <div className="flex flex-row gap-4">
            {user.role == "admin" || user.role == "moderator" || user.role == "analyst" ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative">
                            <ShieldAlert
                             className="h-4 w-4 mr-2" />
                            <p className="hidden xl:block">Article Queue {queueNotifications.length ? `(${queueNotifications.length})` : ""}</p>

                            {queueNotifications.length ? (
                                <span className="absolute top-1 right-1 transform translate-x-1/12 -translate-y-1/12 h-2 w-2 rounded-full bg-red-500" />
                            ) : ""}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-90 max-h-[400px] overflow-auto">
                        <div className="grid gap-4 p-4">
                            <h4 className="font-medium leading-none">Article Queue</h4>
                            {queueNotifications.length != 0 ? queueNotifications.map((notification, index) => (
                                <div key={index}>
                                    <NotificationItem notification={notification} token={token}/>
                                <Separator />
                            </div>
                            )): (
                                <p className="text-sm">No Articles in Queue</p>
                            )}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            ): ""}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative">
                        <Bell className="h-4 w-4 lg:mr-2" />
                        <p className="hidden xl:block">Notifications {userNotifications.length ? `(${userNotifications.length})` : ""}</p>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-90 max-h-[400px] overflow-auto">
                    <div className="grid gap-4 p-4">
                        <h4 className="font-medium leading-none">Notifications</h4>
                        {userNotifications.length != 0 ? userNotifications.map((notification, index) => (
                            <div key={index}>
                                <NotificationItem notification={notification} token={token}/>
                            <Separator />
                         </div>
                        )): (
                            <p className="text-sm">No notifications</p>
                        )}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
export default NotificationDropdown;
