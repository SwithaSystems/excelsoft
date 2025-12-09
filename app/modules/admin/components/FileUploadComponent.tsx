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

  // result returned by server (same shape as ImportResult in your other screen)
  const [result, setResult] = useState<any | null>(null);

  // choose enabled when at least one dropdown label changed
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
        setSelectedFile((res as any).assets[0]);
        Alert.alert("Success", `File selected: ${(res as any).assets[0].name}`);
      } else if (res && (res as any).name && (res as any).uri) {
        setSelectedFile(res);
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
    // require at least one label-selected dropdown and a file
    if (
      (selectedEntityLabel === "Select Entity" &&
        selectedVendorLabel === "Select Vendor") ||
      !selectedFile
    ) {
      Alert.alert("Error", "Please select entity or vendor and choose a file");
      return;
    }

    setIsUploading(true);
    setResult(null); // clear previous result
    try {
      const uploadData = {
        entityType: selectedEntity,
        fileName: selectedFile.name,
        fileUri: selectedFile.uri,
        vendor: selectedVendor,
      };

      const formData = new FormData();
      formData.append("entityType", uploadData.entityType);
      formData.append("fileName", uploadData.fileName);
      formData.append("vendor", uploadData.vendor);

      if (Platform.OS === "web") {
        const resp = await fetch(uploadData.fileUri);
        const blob = await resp.blob();
        formData.append("file", blob, uploadData.fileName);
      } else {
        formData.append("file", {
          uri: uploadData.fileUri,
          name: uploadData.fileName,
          type: selectedFile.type || "application/octet-stream",
        } as any);
      }

      const vendorSelected = selectedVendor && selectedVendor.trim() !== "";
      const vendorLabelSelected = selectedVendorLabel !== "Select Vendor";

      if (vendorSelected || vendorLabelSelected) {
        // vendor branch -> call PDF import endpoint with axios
        try {
          const url = `${API_URL}/product-import/upload-pdf`;
          const response = await axios.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 300000,
          });

          // store full response (regardless of property names)
          setResult(
            response.data ?? { success: false, message: "Empty response" }
          );

          // show user feedback
          if (response.data?.success) {
            Alert.alert("Success", "PDF import uploaded successfully");
          } else {
            // if backend uses different key, still show message if present
            Alert.alert(
              "Upload result",
              response.data?.message ?? "Completed with warnings"
            );
          }

          // reset selects and file
          setSelectedEntity("");
          setSelectedEntityLabel("Select Entity");
          setSelectedVendor("");
          setSelectedVendorLabel("Select Vendor");
          setSelectedFile(null);

          if (onUploadComplete) onUploadComplete(response.data);
        } catch (err: any) {
          console.error("Vendor upload error:", err);
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
        // entity branch -> use existing ProductsAPI method
        try {
          const resp = await ProductsAPI.addProduct_Catagory_Upload_File(
            formData
          );
          if (!resp) throw new Error("No response from server");
          const json = await resp.json();

          // set result from entity response (if it contains statistics)
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
          console.error("Entity upload error:", apiErr);
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

  // small local styles for result UI (keeps rendering independent of external stylesheet)
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

      {/* Loader */}
      {isUploading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Processing PDF…</Text>
        </View>
      )}

      {/* Result display */}
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
