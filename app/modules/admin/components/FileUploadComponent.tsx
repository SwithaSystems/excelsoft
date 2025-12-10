import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import ModalSelector from "react-native-modal-selector";
import Ionicons from "react-native-vector-icons/Ionicons";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import Header from "@/app/components/Header";
import { FILE_UPLOAD } from "@/constants/stringLiterals";
import styles from "../FileUploadAddProductCategoryStyles";
import colors from "@/constants/colors";
import axios from "axios";
import { ProductsAPI } from "@/services/productService";
import { EntityAPI } from "@/services/entityService";

interface FileUploadProps {
  onUploadComplete?: (result: any) => void;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const ensureOptionShape = (arr: any[]) =>
  arr.map((it, i) => ({
    label: it.label ?? it.name ?? String(it),
    value: it.value ?? it.key ?? (it.name ? it.name.toLowerCase() : String(i)),
    key: it.key ?? it.value ?? String(i),
  }));

const resolveOption = (option: any, dataset: any[]) => {
  if (option == null) return { value: "", label: "" };
  if (typeof option === "number") {
    const found = dataset[option] ?? {};
    return {
      value: found.value ?? "",
      label: found.label ?? String(found.value ?? option),
    };
  }
  if (typeof option === "string") {
    const found =
      dataset.find((d) => d.label === option || d.value === option) ?? {};
    return { value: found.value ?? option, label: found.label ?? option };
  }
  const value = option.value ?? option.key ?? option.label ?? "";
  const label = option.label ?? option.value ?? option.key ?? String(value);
  return { value: String(value), label: String(label) };
};

const FileUploadComponent: React.FC<FileUploadProps> = ({
  onUploadComplete,
}) => {
  const [selectedEntity, setSelectedEntity] = useState<string>("");
  const [selectedEntityLabel, setSelectedEntityLabel] =
    useState<string>("Select Entity");
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [selectedVendorLabel, setSelectedVendorLabel] =
    useState<string>("Select Vendor");

  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [entityOptions, setEntityOptions] = useState<any[]>(
    ensureOptionShape([{ label: "Select Entity", value: "", key: "" }])
  );
  const [vendorOptions, setVendorOptions] = useState<any[]>(
    ensureOptionShape([{ label: "Select Vendor", value: "", key: "" }])
  );

  const [result, setResult] = useState<any | null>(null);

  const isChooseDisabled =
    selectedEntityLabel === "Select Entity" &&
    selectedVendorLabel === "Select Vendor";

  const handleChooseFile = async () => {
    if (isChooseDisabled) {
      Alert.alert(
        "Error",
        "Please select at least an entity or a vendor first"
      );
      return;
    }

    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["*/*"],
        copyToCacheDirectory: true,
        multiple: false,
      } as any);

      if (res && (res as any).assets && (res as any).assets.length > 0) {
        const file = (res as any).assets[0];
        setSelectedFile(file);

        // DEBUG: Log file details
        console.log("=== FILE SELECTION DEBUG ===");
        console.log("File name:", file.name);
        console.log("File size:", file.size);
        console.log("File type:", file.type || file.mimeType);
        console.log("File URI:", file.uri);
        console.log("Full file object:", JSON.stringify(file, null, 2));

        Alert.alert("Success", `File selected: ${file.name}`);
      } else if (res && (res as any).name && (res as any).uri) {
        setSelectedFile(res);

        // DEBUG: Log file details
        console.log("=== FILE SELECTION DEBUG (Legacy) ===");
        console.log("File name:", (res as any).name);
        console.log("File size:", (res as any).size);
        console.log("File type:", (res as any).type);
        console.log("File URI:", (res as any).uri);
        console.log("Full file object:", JSON.stringify(res, null, 2));

        Alert.alert("Success", `File selected: ${(res as any).name}`);
      } else if ((res as any).canceled) {
        console.log("User cancelled file selection");
      } else {
        console.log("Unexpected picker result:", res);
      }
    } catch (err) {
      console.error("Error picking file:", err);
      Alert.alert("File Selection Error", "Unable to select file.");
    }
  };

  const handleUpload = async () => {
    if (
      (selectedEntityLabel === "Select Entity" &&
        selectedVendorLabel === "Select Vendor") ||
      !selectedFile
    ) {
      Alert.alert("Error", "Please select entity or vendor and choose a file");
      return;
    }

    setIsUploading(true);
    setResult(null);

    try {
      const uploadData = {
        entityType: selectedEntity,
        fileName: selectedFile.name,
        fileUri: selectedFile.uri,
        vendor: selectedVendor,
      };

      // DEBUG: Log upload data
      console.log("=== UPLOAD DATA DEBUG ===");
      console.log("Entity Type:", uploadData.entityType);
      console.log("File Name:", uploadData.fileName);
      console.log("File URI:", uploadData.fileUri);
      console.log("Vendor:", uploadData.vendor);
      console.log("Selected Entity Label:", selectedEntityLabel);
      console.log("Selected Vendor Label:", selectedVendorLabel);

      const formData = new FormData();
      formData.append("entityType", uploadData.entityType);
      formData.append("fileName", uploadData.fileName);
      formData.append("vendor", uploadData.vendor);

      if (Platform.OS === "web") {
        console.log("=== WEB PLATFORM: Fetching blob ===");
        const resp = await fetch(uploadData.fileUri);
        const blob = await resp.blob();
        console.log("Blob size:", blob.size);
        console.log("Blob type:", blob.type);
        formData.append("file", blob, uploadData.fileName);
      } else {
        console.log("=== MOBILE PLATFORM: Appending file ===");
        const fileObject = {
          uri: uploadData.fileUri,
          name: uploadData.fileName,
          type: selectedFile.type || selectedFile.mimeType || "application/pdf",
        };
        console.log(
          "File object being appended:",
          JSON.stringify(fileObject, null, 2)
        );
        formData.append("file", fileObject as any);
      }

      // DEBUG: Log FormData contents (note: can't directly log FormData on mobile)
      console.log("=== FORMDATA DEBUG ===");
      if (Platform.OS === "web") {
        // On web, we can iterate FormData
        for (let pair of (formData as any).entries()) {
          console.log(`${pair[0]}:`, pair[1]);
        }
      } else {
        console.log("FormData created (cannot iterate on mobile)");
        console.log("FormData fields: entityType, fileName, vendor, file");
      }

      const vendorSelected = selectedVendor && selectedVendor.trim() !== "";
      const vendorLabelSelected = selectedVendorLabel !== "Select Vendor";

      console.log("=== UPLOAD BRANCH DEBUG ===");
      console.log("Vendor selected:", vendorSelected);
      console.log("Vendor label selected:", vendorLabelSelected);
      console.log(
        "Will use vendor branch:",
        vendorSelected || vendorLabelSelected
      );

      if (vendorSelected || vendorLabelSelected) {
        // VENDOR BRANCH
        console.log("=== VENDOR PDF UPLOAD ===");
        try {
          const url = `${API_URL}/product-import/upload-pdf`;
          console.log("Upload URL:", url);
          console.log("Request headers:", {
            "Content-Type": "multipart/form-data",
          });
          console.log("Timeout: 300000ms");

          console.log("Sending request to backend...");
          const response = await axios.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 300000,
          });

          console.log("=== BACKEND RESPONSE ===");
          console.log("Status:", response.status);
          console.log("Response data:", JSON.stringify(response.data, null, 2));
          console.log(
            "Response headers:",
            JSON.stringify(response.headers, null, 2)
          );

          setResult(
            response.data ?? { success: false, message: "Empty response" }
          );

          if (response.data?.success) {
            Alert.alert("Success", "PDF import uploaded successfully");
          } else {
            Alert.alert(
              "Upload result",
              response.data?.message ?? "Completed with warnings"
            );
          }

          setSelectedEntity("");
          setSelectedEntityLabel("Select Entity");
          setSelectedVendor("");
          setSelectedVendorLabel("Select Vendor");
          setSelectedFile(null);

          if (onUploadComplete) onUploadComplete(response.data);
        } catch (err: any) {
          console.error("=== VENDOR UPLOAD ERROR ===");
          console.error("Error message:", err.message);
          console.error("Error response:", err.response?.data);
          console.error("Error status:", err.response?.status);
          console.error("Full error:", err);

          setResult({
            success: false,
            message: err.message ?? "Vendor upload failed",
            statistics: {
              totalProducts: 0,
              inserted: 0,
              updated: 0,
              failed: 0,
            },
          });
          Alert.alert("Upload Error", "Vendor PDF upload failed");
        }
      } else {
        // ENTITY BRANCH
        console.log("=== ENTITY UPLOAD ===");
        try {
          const resp = await ProductsAPI.addProduct_Catagory_Upload_File(
            formData
          );
          if (!resp) throw new Error("No response from server");
          const json = await resp.json();

          console.log("=== ENTITY RESPONSE ===");
          console.log("Response:", JSON.stringify(json, null, 2));

          setResult(
            json ?? {
              success: true,
              message: "Uploaded",
              statistics: {
                totalProducts: 0,
                inserted: 0,
                updated: 0,
                failed: 0,
              },
            }
          );

          Alert.alert("Success", "File uploaded successfully");
          setSelectedEntity("");
          setSelectedEntityLabel("Select Entity");
          setSelectedVendor("");
          setSelectedVendorLabel("Select Vendor");
          setSelectedFile(null);

          if (onUploadComplete) onUploadComplete(json);
        } catch (apiErr: any) {
          console.error("=== ENTITY UPLOAD ERROR ===");
          console.error("Error:", apiErr);

          setResult({
            success: false,
            message: apiErr.message ?? "Entity upload failed",
            statistics: {
              totalProducts: 0,
              inserted: 0,
              updated: 0,
              failed: 0,
            },
          });
          Alert.alert(
            "Upload",
            "Server upload failed — saved locally for now (simulated)"
          );
          if (onUploadComplete) onUploadComplete(uploadData);
        }
      }
    } catch (err: any) {
      console.error("=== GENERAL UPLOAD ERROR ===");
      console.error(err);

      setResult({
        success: false,
        message: err.message ?? String(err),
        statistics: { totalProducts: 0, inserted: 0, updated: 0, failed: 0 },
      });
      Alert.alert("Upload Error", String(err));
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const opts = await EntityAPI.getEntityOptions();
        setEntityOptions(ensureOptionShape(opts));
      } catch (e) {
        console.error(e);
        setEntityOptions(
          ensureOptionShape([
            { label: "Select Entity", value: "", key: "" },
            { label: "Products", value: "products", key: "products" },
            { label: "Categories", value: "categories", key: "categories" },
          ])
        );
      }
    };

    setVendorOptions(
      ensureOptionShape([
        { label: "Select Vendor", value: "", key: "" },
        {
          label: "Bookers retail",
          value: "bookers_retail",
          key: "bookers_retail",
        },
      ])
    );
    fetch();
  }, []);

  const resultStyles = StyleSheet.create({
    container: {
      marginTop: 20,
      backgroundColor: "#fff",
      borderRadius: 8,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "#ddd",
    },
    header: { padding: 12, alignItems: "center" },
    successHeader: { backgroundColor: "#e6f9ea" },
    errorHeader: { backgroundColor: "#ffecec" },
    title: { fontSize: 18, fontWeight: "700" },
    stats: { padding: 12 },
    statRow: { fontSize: 15, marginBottom: 6 },
    message: { padding: 12, color: "#333" },
  });

  return (
    <PageLayout
      hasFooter
      hasHeader
      scrollable={false}
      headerComponent={<Header headerText={FILE_UPLOAD} />}
    >
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select Entity:</Text>
        <ModalSelector
          data={entityOptions}
          initValue={selectedEntityLabel}
          onChange={(option: any) => {
            const resolved = resolveOption(option, entityOptions as any);
            setSelectedEntity(resolved.value);
            setSelectedEntityLabel(resolved.label);
          }}
          keyExtractor={(item: any) => item.key}
          labelExtractor={(item: any) => item.label}
          style={styles.modalSelector}
          initValueTextStyle={styles.modalInitValue}
          selectTextStyle={styles.modalSelectedText}
          optionTextStyle={styles.modalOptionText}
          selectedItemTextStyle={styles.modalSelectedItemText}
        >
          <View style={styles.modalTrigger}>
            <Text style={styles.modalTriggerText}>{selectedEntityLabel}</Text>
            <View style={styles.modalTriggerIcon}>
              <Ionicons name="caret-down" size={20} color={colors.primary} />
            </View>
          </View>
        </ModalSelector>
      </View>

      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select Vendor:</Text>
        <ModalSelector
          data={vendorOptions}
          initValue={selectedVendorLabel}
          onChange={(option: any) => {
            const resolved = resolveOption(option, vendorOptions as any);
            setSelectedVendor(resolved.value);
            setSelectedVendorLabel(resolved.label);
          }}
          keyExtractor={(item: any) => item.key}
          labelExtractor={(item: any) => item.label}
          style={styles.modalSelector}
          initValueTextStyle={styles.modalInitValue}
          selectTextStyle={styles.modalSelectedText}
          optionTextStyle={styles.modalOptionText}
          selectedItemTextStyle={styles.modalSelectedItemText}
        >
          <View style={styles.modalTrigger}>
            <Text style={styles.modalTriggerText}>{selectedVendorLabel}</Text>
            <View style={styles.modalTriggerIcon}>
              <Ionicons name="caret-down" size={20} color={colors.primary} />
            </View>
          </View>
        </ModalSelector>
      </View>

      {selectedFile && (
        <View style={styles.fileInfoContainer}>
          <Text style={styles.fileInfoText}>
            Selected File: {selectedFile.name}
          </Text>
          <Text style={styles.fileInfoText}>
            Size:{" "}
            {selectedFile.size
              ? `${(selectedFile.size / 1024).toFixed(2)} KB`
              : "Unknown"}
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.chooseButton,
            isChooseDisabled && styles.buttonDisabled,
          ]}
          onPress={handleChooseFile}
          disabled={isChooseDisabled}
        >
          <Text style={styles.buttonText}>Choose File</Text>
        </TouchableOpacity>
      </View>

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

      {isUploading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Processing PDF…</Text>
        </View>
      )}

      {result && (
        <View style={resultStyles.container}>
          <View
            style={[
              resultStyles.header,
              result.success
                ? resultStyles.successHeader
                : resultStyles.errorHeader,
            ]}
          >
            <Text style={resultStyles.title}>
              {result.success ? "Import Complete" : "Import Failed"}
            </Text>
          </View>

          <View style={resultStyles.stats}>
            <Text style={resultStyles.statRow}>
              Message: {result.message ?? result.msg ?? "No message"}
            </Text>
            <Text style={resultStyles.statRow}>
              Total Products:{" "}
              {result.statistics?.totalProducts ??
                result.statistics?.total ??
                "N/A"}
            </Text>
            <Text style={resultStyles.statRow}>
              Inserted: {result.statistics?.inserted ?? "N/A"}
            </Text>
            <Text style={resultStyles.statRow}>
              Updated: {result.statistics?.updated ?? "N/A"}
            </Text>
            <Text style={resultStyles.statRow}>
              Failed: {result.statistics?.failed ?? "N/A"}
            </Text>
          </View>
        </View>
      )}
    </PageLayout>
  );
};

export default FileUploadComponent;
