import React from "react";
import { useWindowDimensions, View } from "react-native";
import FileUploadComponent from "./components/FileUploadComponent";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import BrandHeader from "@/app/components/BrandHeader";
import Header from "@/app/components/Header";

const fileUploadAddProductCategory = () => {
  const handleUploadComplete = (result: any) => {
    // console.log("Upload completed:", result);
    // Handle successful upload
  };

  const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const isTabOrDesktop = width >= 768;
  
    const HeaderComponent = isTabOrDesktop ? <BrandHeaderWeb /> : <Header headerText="File Upload" />;
    const LayoutComponent = isTabOrDesktop ? PageLayoutWeb : PageLayout;

  return (
      <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter
      footerComponent={false}
      hasSidebar={isTabOrDesktop}
      scrollable
      hideNavItems={true}
    >
    <View style={{ flex: 1 }}>
      <FileUploadComponent onUploadComplete={handleUploadComplete} />
    </View>
    </LayoutComponent>
  );
};

export default fileUploadAddProductCategory;
