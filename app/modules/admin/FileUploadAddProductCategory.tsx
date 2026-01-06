import React from "react";
import { Platform, View } from "react-native";
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

  const isWeb = Platform.OS === "web";
  const isMobile = !isWeb;
  
    const HeaderComponent = isWeb ? (
    <BrandHeaderWeb hideUserGreeting={true} />
    ) : (
      <Header headerText="File Upload" />
    );
    const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;

  return (
      <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter
      footerComponent={false}
      hasSidebar={isWeb}
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
