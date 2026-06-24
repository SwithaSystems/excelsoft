import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import ModalSelector from "react-native-modal-selector";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../FileUploadAddProductCategoryStyles";
import colors from "@/constants/colors";
import {
  ProductsAPI,
  type ProductImportStatistics,
} from "@/services/productService";
import { EntityAPI } from "@/services/entityService";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";
import useConfirmationAlert from "@/app/components/commonComponents/useConfirmationAlert";

interface FileUploadProps {
  onUploadComplete?: (result: any) => void;
}

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

const getTotalProducts = (statistics?: ProductImportStatistics) =>
  statistics?.totalExtracted ??
  statistics?.totalProducts ??
  statistics?.total ??
  "N/A";

const FileUploadComponent: React.FC<FileUploadProps> = ({
  onUploadComplete,
}) => {
  const { showAlert, confirmationModal } = useConfirmationAlert();
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

    const isWeb = Platform.OS === "web";
    const { isMobile } = useWebMediaQuery();
    const isMobileWeb = isWeb && isMobile;
    const isDesktopWeb = isWeb && !isMobileWeb;

  const isChooseDisabled =
    selectedEntityLabel === "Select Entity" &&
    selectedVendorLabel === "Select Vendor";

  const handleChooseFile = async () => {
    if (isChooseDisabled) {
      showAlert(
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
        // console.log("=== FILE SELECTION DEBUG ===");
        // console.log("File name:", file.name);
        // console.log("File size:", file.size);
        // console.log("File type:", file.type || file.mimeType);
        // console.log("File URI:", file.uri);
        // console.log("Full file object:", JSON.stringify(file, null, 2));

        showAlert("Success", `File selected: ${file.name}`);
      } else if (res && (res as any).name && (res as any).uri) {
        setSelectedFile(res);

        // DEBUG: Log file details
        // console.log("=== FILE SELECTION DEBUG (Legacy) ===");
        // console.log("File name:", (res as any).name);
        // console.log("File size:", (res as any).size);
        // console.log("File type:", (res as any).type);
        // console.log("File URI:", (res as any).uri);
        // console.log("Full file object:", JSON.stringify(res, null, 2));

        showAlert("Success", `File selected: ${(res as any).name}`);
      } else if ((res as any).canceled) {
        // console.log("User cancelled file selection");
      } else {
        // console.log("Unexpected picker result:", res);
      }
    } catch (err) {
      console.error("Error picking file:", err);
      showAlert("File Selection Error", "Unable to select file.");
    }
  };

  const handleUpload = async () => {
    if (
      (selectedEntityLabel === "Select Entity" &&
        selectedVendorLabel === "Select Vendor") ||
      !selectedFile
    ) {
      showAlert("Error", "Please select entity or vendor and choose a file");
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

      const formData = new FormData();
      formData.append("entityType", uploadData.entityType);
      formData.append("fileName", uploadData.fileName);
      formData.append("vendor", uploadData.vendor);

      if (Platform.OS === "web") {
        const resp = await fetch(uploadData.fileUri);
        const blob = await resp.blob();
        formData.append("file", blob, uploadData.fileName);
      } else {
        const fileObject = {
          uri: uploadData.fileUri,
          name: uploadData.fileName,
          type: selectedFile.type || selectedFile.mimeType || "application/pdf",
        };
        formData.append("file", fileObject as any);
      }

      const vendorSelected = selectedVendor && selectedVendor.trim() !== "";
      const vendorLabelSelected = selectedVendorLabel !== "Select Vendor";

      if (vendorSelected || vendorLabelSelected) {
        // VENDOR BRANCH
        try {
          const uploadResult = await ProductsAPI.uploadProductImportPdf(formData);
          const finalResult = uploadResult?.queued && uploadResult.jobId
            ? await ProductsAPI.waitForProductImportResult(uploadResult.jobId)
            : uploadResult;

          setResult(finalResult ?? { success: false, message: "Empty response" });

          if (finalResult?.success) {
            const stats = finalResult.statistics ?? {};
            showAlert(
              "Success",
              `PDF import completed\n` +
                `Total: ${getTotalProducts(stats)}\n` +
                `Inserted: ${stats.inserted ?? "N/A"}\n` +
                `Updated: ${stats.updated ?? "N/A"}\n` +
                `Failed: ${stats.failed ?? "N/A"}`
            );
          } else {
            showAlert(
              "Upload result",
              finalResult?.message ?? "Completed with warnings"
            );
          }

          setSelectedEntity("");
          setSelectedEntityLabel("Select Entity");
          setSelectedVendor("");
          setSelectedVendorLabel("Select Vendor");
          setSelectedFile(null);

          if (onUploadComplete) onUploadComplete(finalResult);
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
          showAlert("Upload Error", "Vendor PDF upload failed");
        }
      } else {
        // ENTITY BRANCH
        try {
          const resp = await ProductsAPI.addProduct_Catagory_Upload_File(
            formData
          );
          if (!resp) throw new Error("No response from server");
          const json = await resp.json();

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

          showAlert("Success", "File uploaded successfully");
          setSelectedEntity("");
          setSelectedEntityLabel("Select Entity");
          setSelectedVendor("");
          setSelectedVendorLabel("Select Vendor");
          setSelectedFile(null);

          if (onUploadComplete) onUploadComplete(json);
        } catch (apiErr: any) {
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
          showAlert(
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
      showAlert("Upload Error", String(err));
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
    <View style={[styles.pageContainer, isWeb && styles.pageContainerWeb]}>
      <View
        style={[
          styles.card,
          isWeb && styles.cardWeb,
          isMobileWeb && styles.cardMobileWeb,
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.title}>Upload bulk data</Text>
            <Text style={styles.subtitle}>
              Choose an entity or vendor, then select a file and upload it.
            </Text>
          </View>
        </View>

        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerTitle}>Tip</Text>
          <Text style={styles.infoBannerText}>
            Select a Vendor for PDF imports, or an Entity for products/categories uploads. Then choose a file to continue.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>Select Entity</Text>
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
            <Text style={styles.label}>Select Vendor</Text>
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
        </View>

        {selectedFile && (
          <View style={styles.fileInfoContainer}>
            <Text style={styles.fileInfoText}>Selected File: {selectedFile.name}</Text>
            <Text style={styles.fileInfoText}>
              Size:{" "}
              {selectedFile.size
                ? `${(selectedFile.size / 1024).toFixed(2)} KB`
                : "Unknown"}
            </Text>
          </View>
        )}

        <View style={[styles.buttonRow, isMobileWeb && styles.buttonRowMobileWeb]}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.chooseButton,
              isChooseDisabled && styles.buttonDisabled,
            ]}
            onPress={handleChooseFile}
            disabled={isChooseDisabled}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Choose File</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.uploadButton,
              (!selectedFile || isUploading) && styles.buttonDisabled,
            ]}
            onPress={handleUpload}
            disabled={!selectedFile || isUploading}
            activeOpacity={0.85}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Upload File</Text>
            )}
          </TouchableOpacity>
        </View>

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
                result.success ? resultStyles.successHeader : resultStyles.errorHeader,
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
                {getTotalProducts(result.statistics)}
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

        {confirmationModal}
      </View>
    </View>
  );
};

export default FileUploadComponent;
