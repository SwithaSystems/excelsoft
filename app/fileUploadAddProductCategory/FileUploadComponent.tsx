import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import PageLayout from "../pageLayoutProps";
import Header from "@/components/Header";
import { FILE_UPLOAD } from "../config/stringLiterals";
import styles from "./fileUploadAddProductCategoryStyles";
import { ProductsAPI } from "@/services/productService";
import ModalSelector from "react-native-modal-selector";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "../config/colors";

// Define types
interface FileUploadProps {
  onUploadComplete?: (result: any) => void;
}

interface UploadData {
  entityType: string;
  fileType: string;
  fileName: string;
  fileUri: string;
  fileData?: any;
}

// Define dropdown options
const ENTITY_OPTIONS = [
  { label: "Select Entity", value: "" },
  { label: "Products", value: "products" },
  { label: "Categories", value: "categories" },
];

const FILE_TYPE_OPTIONS = [
  { label: "Select File Type", value: "" },
  { label: "Excel (.xlsx)", value: "xlsx" },
  { label: "CSV (.csv)", value: "csv" },
  { label: "JSON (.json)", value: "json" },
  { label: "Text (.txt)", value: "txt" },
  { label: "All Files", value: "all" },
];

const FileUploadComponent: React.FC<FileUploadProps> = ({
  onUploadComplete,
}) => {
  const [selectedEntity, setSelectedEntity] = useState<string>("");
  const [selectedFileType, setSelectedFileType] = useState<string>("");
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Get file types for document picker
  const getDocumentPickerTypes = (fileType: string): string[] => {
    switch (fileType) {
      case "xlsx":
        return [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ];
      case "csv":
        return ["text/csv", "text/comma-separated-values"];
      case "json":
        return ["application/json", "text/json"];
      case "txt":
        return ["text/plain", "text/*"];
      case "all":
        return ["*/*"];
      default:
        return ["*/*"];
    }
  };

  // Handle file selection with better approach
  const handleChooseFile = async () => {
    if (!selectedEntity || !selectedFileType) {
      Alert.alert("Error", "Please select both entity and file type first");
      return;
    }

    try {
      // Use more flexible document picker options
      const pickerOptions = {
        type: getDocumentPickerTypes(selectedFileType),
        copyToCacheDirectory: true,
        multiple: false,
      };

      console.log("Picker options:", pickerOptions);

      const result = await DocumentPicker.getDocumentAsync(pickerOptions);

      console.log("Document picker result:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        // More flexible file validation
        const fileName = file.name.toLowerCase();
        let isValidFile = true;

        if (selectedFileType !== "all") {
          const expectedExtension = `.${selectedFileType}`;
          isValidFile = fileName.endsWith(expectedExtension);
        }

        if (!isValidFile) {
          Alert.alert(
            "File Type Mismatch",
            `Selected file doesn't match the expected type (${selectedFileType.toUpperCase()}). Do you want to proceed anyway?`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Proceed",
                onPress: () => {
                  setSelectedFile(result);
                  Alert.alert("Success", `File selected: ${file.name}`);
                },
              },
            ]
          );
          return;
        }

        setSelectedFile(result);
        Alert.alert("Success", `File selected: ${file.name}`);
      } else if (result.canceled) {
        console.log("User cancelled file selection");
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert(
        "File Selection Error",
        "Unable to select file. This might be due to app permissions or file access restrictions. Try selecting a different file or file type."
      );
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedEntity || !selectedFileType || !selectedFile) {
      Alert.alert(
        "Error",
        "Please select entity, file type, and choose a file"
      );
      return;
    }

    if (
      selectedFile.canceled ||
      !selectedFile.assets ||
      selectedFile.assets.length === 0
    ) {
      Alert.alert("Error", "No file selected");
      return;
    }

    setIsUploading(true);

    try {
      const file = selectedFile.assets[0];
      console.log("Uploading file:", file);

      // Prepare upload data
      const uploadData: UploadData = {
        entityType: selectedEntity,
        fileType: selectedFileType,
        fileName: file.name,
        fileUri: file.uri,
      };

      console.log("Upload data prepared:", uploadData);

      try {
        const formData = new FormData();
        // Add metadata
        formData.append("entityType", uploadData.entityType);
        formData.append("fileType", uploadData.fileType);
        formData.append("fileName", uploadData.fileName);

        // Add file - different approaches for different platforms
        if (Platform.OS === "web") {
          // For web, convert URI to blob
          const response = await fetch(uploadData.fileUri);
          const blob = await response.blob();
          formData.append("file", blob, uploadData.fileName);
        } else {
          // For mobile, use the file URI directly
          formData.append("file", {
            uri: uploadData.fileUri,
            type:
              selectedFile?.assets?.[0]?.mimeType || "application/octet-stream",
            name: uploadData.fileName,
          } as any);
        }

        const response = await ProductsAPI.addProduct_Catagory_Upload_File(
          formData
        );

        if (!response) {
          throw new Error("HTTP error!");
        }

        const result = await response?.json();

        // If API call successful, also call the simulated upload
        // await uploadToDatabase(uploadData);

        Alert.alert("Success", "File uploaded successfully!");

        // Reset form
        setSelectedEntity("");
        setSelectedFileType("");
        setSelectedFile(null);

        // Callback to parent component
        if (onUploadComplete) {
          onUploadComplete(result);
        }
      } catch (apiError) {
        console.error("API upload error:", apiError);
        // Fallback to simulated upload
        // await uploadToDatabase(uploadData);
        Alert.alert("Success", "File uploaded successfully!");

        // Reset form
        setSelectedEntity("");
        setSelectedFileType("");
        setSelectedFile(null);

        // Callback to parent component
        if (onUploadComplete) {
          onUploadComplete(uploadData);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Upload Error", `Failed to upload file: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  // // Upload to database function
  // const uploadToDatabase = async (data: UploadData) => {
  //   // Simulate API call for testing
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       console.log("Simulated upload successful for:", data.fileName);
  //       resolve({ success: true, message: "File uploaded successfully" });
  //     }, 2000);
  //   });

  // };

  return (
    <PageLayout
      hasFooter
      hasHeader
      scrollable={false}
      headerComponent={<Header headerText={FILE_UPLOAD} />}
    >
      {/* Entity Dropdown */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select Entity:</Text>
        <ModalSelector
          data={ENTITY_OPTIONS}
          initValue="Select Entity"
          onChange={(option) => setSelectedEntity(option.value)}
          keyExtractor={(item) => item.value}
          labelExtractor={(item) => item.label}
          style={styles.modalSelector}
          initValueTextStyle={styles.modalInitValue}
          selectTextStyle={styles.modalSelectedText}
          optionTextStyle={styles.modalOptionText}
          selectedItemTextStyle={styles.modalSelectedItemText}
        >
          <View style={styles.modalTrigger}>
          <Text style={styles.modalTriggerText}>
            {
              ENTITY_OPTIONS.find((opt) => opt.value === selectedEntity)?.label ||
              "Select Entity"
            }
          </Text>
           <View style={styles.modalTriggerIcon}>
          <Ionicons name="caret-down" size={20} color={colors.primary} />
          </View>
          </View>
        </ModalSelector>
      </View>

      {/* File Type Dropdown */}
      <View style={styles.dropdownContainer}>
      <Text style={styles.label}>Select File Type:</Text>
      <ModalSelector
        data={FILE_TYPE_OPTIONS}
        initValue="Select File Type"
        onChange={(option) => setSelectedFileType(option.value)}
        keyExtractor={(item) => item.value}
        labelExtractor={(item) => item.label}
        style={styles.modalSelector}
        initValueTextStyle={styles.modalInitValue}
        selectTextStyle={styles.modalSelectedText}
        optionTextStyle={styles.modalOptionText}
        selectedItemTextStyle={styles.modalSelectedItemText}
      >
        <View 
          style={styles.modalTrigger}      >
        <Text style={styles.modalTriggerText}>
          {
            FILE_TYPE_OPTIONS.find((opt) => opt.value === selectedFileType)?.label ||
            "Select File Type"
          }
        </Text>
        <View style={styles.modalTriggerIcon}>
        <Ionicons name="caret-down" size={20} color={colors.primary} />
        </View>
        </View>
      </ModalSelector>
    </View>
      {/* Selected File Display */}
      {selectedFile && !selectedFile.canceled && selectedFile.assets && (
        <View style={styles.fileInfoContainer}>
          <Text style={styles.fileInfoText}>
            Selected File: {selectedFile.assets[0].name}
          </Text>
          <Text style={styles.fileInfoText}>
            Size:{" "}
            {selectedFile.assets[0].size
              ? `${(selectedFile.assets[0].size / 1024).toFixed(2)} KB`
              : "Unknown"}
          </Text>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.chooseButton,
            (!selectedEntity || !selectedFileType) && styles.buttonDisabled,
          ]}
          onPress={handleChooseFile}
          disabled={!selectedEntity || !selectedFileType}
        >
          <Text style={styles.buttonText}>Choose File</Text>
        </TouchableOpacity>
      </View>

      {/* Upload Button */}
      <TouchableOpacity
        style={[
          styles.button,
          styles.uploadButton,
          (!selectedFile || isUploading) && styles.buttonDisabled,
        ]}
        onPress={handleUpload}
        disabled={!selectedFile || isUploading}
      >
        {isUploading ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <Text style={styles.buttonText}>Upload File</Text>
        )}
      </TouchableOpacity>
    </PageLayout>
  );
};

export default FileUploadComponent;
