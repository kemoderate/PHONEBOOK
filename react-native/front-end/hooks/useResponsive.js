import { useWindowDimensions } from "react-native";

export default function useResponsive(){
    const {width} = useWindowDimensions();

    return{
    isMobile:width < 600,
    isTablet:width >= 600 && width < 1024,
    isDesktop:width >= 1024,
    columns:
    width >= 1200 ? 5 : 
    width >= 900 ? 4 :
    width >= 700 ? 3 : 
    width >= 500 ? 2 : 1,
}
}

