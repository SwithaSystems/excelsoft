import { useAppContext } from "@/context/AppContext";

export function usePickupTime() {
  const { settings } = useAppContext();
  const storeTimings = settings?.globalSettings?.options?.TimeWindow;
if(!storeTimings){
    return 2;
}else{
    return 0;
}
}