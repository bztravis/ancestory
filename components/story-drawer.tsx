// components/NodeDrawer.tsx
//@ts-nocheck

import { useState, React } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";

interface StoryDrawerProps {
  nodeData: any; // Replace `any` with your node data type for better type safety
  isOpen: boolean;
}

const StoryDrawer: React.FC<StoryDrawerProps> = ({
  nodeTitle,
  nodeSummary,
  nodeLocation,
  nodeCharacter,
  nodeDate,
  isOpen,
  setOpen,
}) => {
  // const [open, setOpen] = useState(false);
  return (
    <>
      <Drawer open={isOpen} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{nodeTitle}</DrawerTitle>
            <DrawerDescription>
              {nodeDate} - {nodeLocation}
              {nodeCharacter.map((character: string) => (
                <Label key={character} className={cn("mr-1")}>
                  {character}
                </Label>
              ))}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-2">
            <DrawerDescription>{nodeSummary}</DrawerDescription>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <div className='w-[400] h-[100] rounded-full bg-white'></div>
    </>
  );
};

export default StoryDrawer;
