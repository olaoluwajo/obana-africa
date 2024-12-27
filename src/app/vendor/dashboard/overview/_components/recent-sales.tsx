import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const RecentSales = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none"></p>
          {/* <p className="text-sm font-medium leading-none">White T-Shirt</p> */}
        </div>
        <div className="ml-auto font-medium">
          <Badge variant={'outline'} ></Badge>
          {/* <Badge variant={'outline'} >SOLD</Badge> */}
        </div>
      </div>
    </div>
  );
};

export default RecentSales;
