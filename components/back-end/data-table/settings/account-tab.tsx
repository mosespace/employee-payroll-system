'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

export function AccountTab() {
  const [profileImage, setProfileImage] = useState(
    '/placeholder.svg?height=100&width=100',
  );

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-lg font-medium">Your Profile</h2>
        <p className="text-sm text-muted-foreground">
          Please update your profile settings here
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="flex">
            <div className="flex h-10 items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
              epms.com
            </div>
            <Input
              id="username"
              placeholder="username"
              className="rounded-l-none"
              defaultValue="X-AE-A-19"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 h-10 w-10 rounded-full"
                  >
                    <Info className="h-4 w-4" />
                    <span className="sr-only">Username information</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="w-80">
                  <div className="space-y-2">
                    <h3 className="font-medium">Tooltip Title</h3>
                    <p className="text-sm text-muted-foreground">
                      Tooltips display informative text when users hover, focus
                      on, or tap an element.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex gap-2">
            <Select defaultValue="gb">
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gb">
                  <span className="mr-2">🇬🇧</span> +44
                </SelectItem>
                <SelectItem value="us">
                  <span className="mr-2">🇺🇸</span> +1
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="phone"
              type="tel"
              placeholder="(158) 008-9987"
              defaultValue="(158) 008-9987"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Profile Picture</Label>
          <div className="flex items-center gap-4">
            <Image
              src={profileImage || '/placeholder.svg'}
              alt="Profile picture"
              width={64}
              height={64}
              className="rounded-full"
            />
            <div className="flex gap-2">
              <Button variant="secondary">Edit</Button>
              <Button variant="destructive">Delete</Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Biography</Label>
          <Textarea
            id="bio"
            placeholder="Write something about yourself..."
            className="min-h-[100px]"
            defaultValue="Hi there! 👋 I'm X-AE-A-19, an AI enthusiast and fitness aficionado. When I'm not crunching numbers or optimizing algorithms, you can find me hitting the gym."
          />
          <p className="text-sm text-muted-foreground">
            325 characters remaining
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notification</Label>
              <p className="text-sm text-muted-foreground">
                You will be notified when a new email arrives.
              </p>
            </div>
            <Switch id="email-notifications" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound-notifications">Sound Notification</Label>
              <p className="text-sm text-muted-foreground">
                You will be notified with sound when someone messages you.
              </p>
            </div>
            <Switch id="sound-notifications" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
}
