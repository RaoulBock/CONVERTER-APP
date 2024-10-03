import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import * as Print from "expo-print";
import * as DocumentPicker from "expo-document-picker";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";
import Button from "../Button/Button";
import axios from "axios";
import { EXPO_PUBLIC_CLOUDCONVERT_API_KEY } from "@env";

const CLOUDCONVERT_API_KEY = EXPO_PUBLIC_CLOUDCONVERT_API_KEY;

const DocToPdfView = () => {
  const [fileUri, setFileUri] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [isConverting, setIsConverting] = useState(false);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "*/*", // Allow any document type
    });

    if (result.assets.length > 0) {
      setFileUri(result.assets[0].uri);
      setFileName(result.assets[0].name);
      console.log("File selected:", result.assets[0].name);
    }
  };

  const convertDocxToPdf = async (fileUri) => {
    setIsConverting(true);
    try {
      // Read file content
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Create a job
      const createJobResponse = await axios.post(
        "https://api.cloudconvert.com/v2/jobs",
        {
          tasks: {
            "import-1": {
              operation: "import/base64",
              file: fileContent,
              filename: fileName,
            },
            "task-1": {
              operation: "convert",
              input: "import-1",
              output_format: "pdf",
            },
            "export-1": {
              operation: "export/url",
              input: "task-1",
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${CLOUDCONVERT_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const jobId = createJobResponse.data.data.id;

      // Wait for the job to complete
      let exportTask;
      while (true) {
        const jobStatusResponse = await axios.get(
          `https://api.cloudconvert.com/v2/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${CLOUDCONVERT_API_KEY}`,
            },
          }
        );

        const { tasks } = jobStatusResponse.data.data;
        exportTask = tasks.find((task) => task.name === "export-1");

        if (exportTask.status === "finished") {
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
      }

      // Download the converted PDF
      const pdfUrl = exportTask.result.files[0].url;
      const pdfResponse = await axios.get(pdfUrl, {
        responseType: "arraybuffer",
      });

      // Convert arraybuffer to base64
      const pdfBase64 = btoa(
        String.fromCharCode.apply(null, new Uint8Array(pdfResponse.data))
      );

      // Save the PDF locally
      const pdfUri = FileSystem.documentDirectory + "converted.pdf";
      await FileSystem.writeAsStringAsync(pdfUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return pdfUri;
    } catch (error) {
      console.error("Error converting DOCX to PDF:", error);
      throw error;
    } finally {
      setIsConverting(false);
    }
  };

  const convertToPDF = async () => {
    if (!fileUri) {
      console.error("No document selected");
      return;
    }

    try {
      const fileExtension = fileName.split(".").pop().toLowerCase();

      let pdfUri;

      switch (fileExtension) {
        case "txt":
          const textContent = await FileSystem.readAsStringAsync(fileUri);
          const htmlContent = `
            <html><body><pre>${textContent}</pre></body></html>
          `;
          const { uri } = await Print.printToFileAsync({ html: htmlContent });
          pdfUri = uri;
          break;
        case "docx":
          pdfUri = await convertDocxToPdf(fileUri);
          break;
        case "pdf":
          pdfUri = fileUri;
          break;
        default:
          throw new Error("Unsupported file type");
      }

      await shareAsync(pdfUri, { UTI: ".pdf", mimeType: "application/pdf" });
      console.log("PDF shared successfully!");
    } catch (error) {
      console.error("Error converting document to PDF:", error);
    }
  };

  return (
    <View style={styles.container}>
      {fileUri === null ? (
        <>
          <Text style={styles.message}>
            Choose a document to convert to PDF
          </Text>
          <Button onPress={pickDocument} title="Select Document" />
        </>
      ) : (
        <>
          <Text style={styles.message}>Selected Document: {fileName}</Text>
          <Button
            onPress={convertToPDF}
            title={isConverting ? "Converting..." : "Convert to PDF"}
            disabled={isConverting}
          />
        </>
      )}
    </View>
  );
};

export default DocToPdfView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    marginVertical: 16,
  },
});
