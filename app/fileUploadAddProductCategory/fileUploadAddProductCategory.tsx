import React from "react";
import { View } from "react-native";
import FileUploadComponent from "../components/FileUploadComponent";

const fileUploadAddProductCategory = () => {
  const handleUploadComplete = (result: any) => {
    console.log("Upload completed:", result);
    // Handle successful upload
  };
  return (
    <View style={{ flex: 1 }}>
      <FileUploadComponent onUploadComplete={handleUploadComplete} />
    </View>
  );
};

export default fileUploadAddProductCategory;
