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
import colors from "../config/colors";
import { color } from "react-native-elements/dist/helpers";
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

  // Alternative file selection method
  const handleChooseFileAlternative = async () => {
    if (!selectedEntity || !selectedFileType) {
      Alert.alert("Error", "Please select both entity and file type first");
      return;
    }

    try {
      // Use the most permissive options
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Allow all file types
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        console.log("Selected file:", file);

        setSelectedFile(result);
        Alert.alert("Success", `File selected: ${file.name}`);
      }
    } catch (error) {
      console.error("Error with alternative picker:", error);
      Alert.alert("Error", "Failed to select file using alternative method");
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

      // Read file content with error handling
      let fileContent: string;

      try {
        if (Platform.OS === "web") {
          const response = await fetch(file.uri);
          fileContent = await response.text();
        } else {
          try {
            fileContent = await FileSystem.readAsStringAsync(file.uri, {
              encoding: FileSystem.EncodingType.UTF8,
            });
          } catch (encodingError) {
            console.log("UTF8 failed, trying base64:", encodingError);
            fileContent = await FileSystem.readAsStringAsync(file.uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
          }
        }
      } catch (readError) {
        console.error("File read error:", readError);
        throw new Error("Unable to read file content");
      }

      // Prepare upload data
      const uploadData: UploadData = {
        entityType: selectedEntity,
        fileType: selectedFileType,
        fileName: file.name,
        fileUri: file.uri,
        fileData: fileContent,
      };

      console.log("Upload data prepared:", {
        ...uploadData,
        fileData: fileContent.substring(0, 100) + "...",
      });

      // Call your upload API here
      await uploadToDatabase(uploadData);

      Alert.alert("Success", "File uploaded successfully!");

      // Reset form
      setSelectedEntity("");
      setSelectedFileType("");
      setSelectedFile(null);

      // Callback to parent component
      if (onUploadComplete) {
        onUploadComplete(uploadData);
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Upload Error", `Failed to upload file: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Upload to database function
  const uploadToDatabase = async (data: UploadData) => {
    // Simulate API call for testing
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Simulated upload successful for:", data.fileName);
        resolve({ success: true, message: "File uploaded successfully" });
      }, 2000);
    });

    // Uncomment and modify for actual API call
    /*
    const API_BASE_URL = "https://your-api-endpoint.com";
    
    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entityType: data.entityType,
          fileType: data.fileType,
          fileName: data.fileName,
          fileData: data.fileData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Database upload error:", error);
      throw error;
    }
    */
  };

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
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedEntity}
            onValueChange={(itemValue) => setSelectedEntity(itemValue)}
            style={styles.picker}
          >
            {ENTITY_OPTIONS.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* File Type Dropdown */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select File Type:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedFileType}
            onValueChange={(itemValue) => setSelectedFileType(itemValue)}
            style={styles.picker}
          >
            {FILE_TYPE_OPTIONS.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>
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
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Upload File</Text>
        )}
      </TouchableOpacity>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  debugContainer: {
    backgroundColor: "#fff3cd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ffeaa7",
  },
  debugText: {
    fontSize: 12,
    color: "#856404",
    marginBottom: 2,
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  picker: {
    height: 50,
  },
  helpContainer: {
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#bbdefb",
  },
  helpText: {
    fontSize: 14,
    color: "#1976d2",
    textAlign: "center",
    lineHeight: 20,
  },
  fileInfoContainer: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  fileInfoText: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  chooseButton: {
    backgroundColor: colors.primary,
    flex: 1,
    marginRight: 10,
  },
  alternativeButton: {
    backgroundColor: "#FF9800",
    flex: 1,
    marginLeft: 10,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default FileUploadComponent;
