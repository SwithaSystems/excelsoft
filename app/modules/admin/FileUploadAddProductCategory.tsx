import React from "react";
import { Platform, View } from "react-native";
import FileUploadComponent from "./components/FileUploadComponent";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import Header from "@/app/components/Header";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";

const fileUploadAddProductCategory = () => {
  const handleUploadComplete = (result: any) => {
    // console.log("Upload completed:", result);
    // Handle successful upload
  };

  const isWeb = Platform.OS === "web";
  
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb hideUserGreeting={true} />
  ) : (
    <Header headerText="File Upload" />
  );
  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const FooterComponent = isWeb ? <FooterWeb /> : null;

  return (
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter={isWeb}
      footerComponent={FooterComponent || undefined}
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
