// ============================================
// Expo + React Native PDF Upload Screen (TS)
// Uses expo-document-picker instead of RN doc-picker
// ============================================

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import useConfirmationAlert from "@/app/components/commonComponents/useConfirmationAlert";
import {
  ProductsAPI,
  type ProductImportResult,
} from "@/services/productService";

interface UploadData {
  entityType: string;
  // fileType: string;
  fileName: string;
  fileUri: string;
  fileData?: any;
}
const ProductImportScreen: React.FC = () => {
  const { showAlert, confirmationModal } = useConfirmationAlert();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProductImportResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedEntity, setSelectedEntity] = useState<string>("");

  const getTotalProducts = (statistics: ProductImportResult["statistics"]) =>
    statistics?.totalExtracted ??
    statistics?.totalProducts ??
    statistics?.total ??
    "N/A";

  // Pick PDF using expo-document-picker
  const pickPDF = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: false,
      });
      // console.log("Document Picker Result:", res);
      // if (res.type === "cancel") return;
      // Check if user canceled
      if (res.canceled) {
        // console.log("User canceled file selection");
        return;
      }

      // Extract file from assets array (NEW API)
      const pickedFile = res.assets?.[0];
      if (!pickedFile) {
        showAlert("Error", "No file selected");
        return;
      }

      // console.log("Picked File:", pickedFile);

      setSelectedFile(pickedFile);
      setResult(null);

      // Alert.alert("File Selected", `${res.name} ready to upload`);
    } catch (err) {
      console.error(err);
      showAlert("Error", "Failed to pick PDF");
    }
  };

  // console.log("Selected File State:", selectedFile);

  // Upload the PDF to backend
  const uploadPDF = async () => {
    // console.log("Selected File:", selectedFile.name);

    if (!selectedFile) {
      // console.log("No File", "Please select a PDF first");
      return;
    }

    setLoading(true);
    setResult(null);

    const uploadData: UploadData = {
      entityType: selectedEntity,
      // fileType: selectedFileType,
      fileName: selectedFile.name,
      fileUri: selectedFile.uri,
    };

    try {
      const formData = new FormData();
      // Add metadata
      formData.append("entityType", uploadData.entityType);
      // formData.append("fileType", uploadData.fileType);
      formData.append("fileName", uploadData.fileName);

      // Add file - different approaches for different platforms
      if (Platform.OS === "web") {
        // For web, convert URI to bloba
        const response = await fetch(uploadData.fileUri);
        const blob = await response.blob();
        formData.append("file", blob, uploadData.fileName);
      } else {
        // For mobile, use the file URI directly
        formData.append("file", {
          uri: uploadData.fileUri,
          type: selectedFile?.mimeType || "application/pdf",
          name: uploadData.fileName,
        } as any);
      }

      const uploadResult = await ProductsAPI.uploadProductImportPdf(formData);
      const finalResult = uploadResult?.queued && uploadResult.jobId
        ? await ProductsAPI.waitForProductImportResult(uploadResult.jobId)
        : uploadResult;

      // console.log("Response:", response.data);
      setResult(finalResult);

      if (finalResult.success) {
        const stats = finalResult.statistics ?? {};
        showAlert(
          "Success ",
          `Total: ${getTotalProducts(stats)}\n` +
            `Inserted: ${stats.inserted ?? "N/A"}\n` +
            `Updated: ${stats.updated ?? "N/A"}\n` +
            `Failed: ${stats.failed ?? "N/A"}`
        );
      } else {
        showAlert("Import Failed", finalResult.message ?? "Import failed");
      }
    } catch (error: any) {
      console.error(error);
      showAlert("Upload Error", error.message || "Unknown error");

      setResult({
        success: false,
        message: error.message,
        statistics: {
          totalExtracted: 0,
          inserted: 0,
          updated: 0,
          failed: 0,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Product Catalog Import</Text>

        {/* Pick PDF Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={pickPDF}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Select PDF</Text>
        </TouchableOpacity>

        {/* File Details */}
        {selectedFile && (
          <View style={styles.fileInfo}>
            <Text style={styles.fileInfoText}>File: {selectedFile.name}</Text>
          </View>
        )}

        {/* Upload Button */}
        {selectedFile && (
          <TouchableOpacity
            style={[styles.button, styles.uploadButton]}
            onPress={uploadPDF}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}> Upload & Import</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Loader */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007aff" />
            <Text style={styles.loadingText}>Processing PDF…</Text>
          </View>
        )}

        {/* Result */}
        {result && (
          <View style={styles.resultContainer}>
            <View
              style={[
                styles.resultHeader,
                result.success ? styles.successHeader : styles.errorHeader,
              ]}
            >
              <Text style={styles.resultTitle}>
                {result.success ? "Import Complete" : "Import Failed"}
              </Text>
            </View>

            <View style={styles.statisticsContainer}>
              <Text style={styles.statisticsTitle}>Statistics:</Text>

              <Text style={styles.statLine}>
                Total Products: {getTotalProducts(result.statistics)}
              </Text>
              <Text style={styles.statLine}>
                Inserted: {result.statistics?.inserted ?? "N/A"}
              </Text>
              <Text style={styles.statLine}>
                Updated: {result.statistics?.updated ?? "N/A"}
              </Text>
              <Text style={styles.statLine}>
                Failed: {result.statistics?.failed ?? "N/A"}
              </Text>
            </View>
          </View>
        )}
        {confirmationModal}
      </View>
    </ScrollView>
  );
};

export default ProductImportScreen;

// ============================================
// Styles
// ============================================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 15,
    color: "#666",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: "center",
  },
  uploadButton: { backgroundColor: "#34C759" },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  fileInfo: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  fileInfoText: { fontSize: 14, color: "#444" },
  loadingContainer: { marginTop: 25, alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#555" },
  resultContainer: {
    backgroundColor: "white",
    marginTop: 25,
    borderRadius: 10,
    overflow: "hidden",
  },
  resultHeader: { padding: 15 },
  successHeader: { backgroundColor: "#daf5d9" },
  errorHeader: { backgroundColor: "#ffdada" },
  resultTitle: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  statisticsContainer: { padding: 15 },
  statisticsTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  statLine: { fontSize: 15, marginBottom: 6 },
});
