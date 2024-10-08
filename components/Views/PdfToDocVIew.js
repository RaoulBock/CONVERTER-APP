import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import axios from "axios";
import Button from "../Button/Button";
import { EXPO_PUBLIC_CLOUDCONVERT_API_KEY } from "@env";

const CLOUDCONVERT_API_KEY =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzQ3MTZjYWIwODdhM2YyNTE3M2ZlZmU3NTZkZWJhYjA4ODIxYjU2NGU3MjE4ZGNmOTMzNGU3MGE5YWFjZDUwNWNlY2JjNWVmZTY0ZDUwMzAiLCJpYXQiOjE3Mjc5NTE5MDcuNDM4Njk4LCJuYmYiOjE3Mjc5NTE5MDcuNDM4NywiZXhwIjo0ODgzNjI1NTA3LjQzNDEyOCwic3ViIjoiNjk3NzU3MTkiLCJzY29wZXMiOlsidXNlci5yZWFkIiwidXNlci53cml0ZSIsInRhc2sucmVhZCIsInRhc2sud3JpdGUiLCJ3ZWJob29rLnJlYWQiLCJwcmVzZXQucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQud3JpdGUiXX0.GnPILwCchpsrmerVFIK7_a4BdM9nXPgB0Y35KBZ0F7meBsoTczslMJP-IjqdTcictgXoLWYL7hD1BF2_dWm1xejL0eF33zDnqZOVXiNCmakqtJiV0GSmi7rsLLDLTda3Nsmqqw2erLT-71MRdpBKSa2nb4LSS5YqAwtWCIqtgR5dW4XtnVOlgZ4oGkG_zRViFoWjD7DQbJ6e0SSlSfdJ2E0pCPPOjZKNv6phTeKqfn-8L_tgO_9eccu4u_6SkazoXefKgy7xQF4PLnSrfif2weaCWTSYgkkGUfFqxK2IsqaDzkvXPCexeiPhb9_OIugQK-RtpbRY5PDnXZ_fRq5PkOreTOcbA8_GglSkubpltfEY_uqK4jMRrys3_bKCInKSvGJXdElC8-i9QJzR4UsUt_OtPnGEi-AZVQEbTVpXrlICMfceBJxb2dvOWhFT0mwN4PAZa7sjQsdorgr_lptJezBqkdoGLelzEZ6e9r-sBaIPr6DyHZVuvo3owg-KzAXPkTnZx5TJQezNWuY74uAU_he7Hd1Gk4mCtqlna4ixI8FugkPScbue1riFKN6MRdG5yRmbANXEFp0IAUHsAmGYsJe4JzMZDJ9G8Eg_8KpCt8yO3NR6_wZtWu1lrKleQLPNyCuUnIooytEbeJQOayt4kHjl0yoSve52zlPONvQRMBU";

const PdfToDocView = () => {
  const [fileUri, setFileUri] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [isConverting, setIsConverting] = useState(false);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf", // Only allow PDF files
    });

    if (result.assets.length > 0) {
      setFileUri(result.assets[0].uri);
      setFileName(result.assets[0].name);
      console.log("PDF selected:", result.assets[0].name);
    }
  };

  const convertPdfToDoc = async (fileUri) => {
    setIsConverting(true);
    try {
      // Read file content
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Create a job to convert PDF to DOC
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
              output_format: "docx", // Convert to DOCX format
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

      // Download the converted DOCX file
      const docxUrl = exportTask.result.files[0].url;
      const docxResponse = await axios.get(docxUrl, {
        responseType: "arraybuffer",
      });

      // Convert arraybuffer to base64
      const docxBase64 = btoa(
        String.fromCharCode.apply(null, new Uint8Array(docxResponse.data))
      );

      // Save the DOCX locally
      const docxUri = FileSystem.documentDirectory + "converted.docx";
      await FileSystem.writeAsStringAsync(docxUri, docxBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return docxUri;
    } catch (error) {
      console.error("Error converting PDF to DOCX:", error);
      throw error;
    } finally {
      setIsConverting(false);
    }
  };

  const convertToDoc = async () => {
    if (!fileUri) {
      console.error("No document selected");
      return;
    }

    try {
      const docxUri = await convertPdfToDoc(fileUri);
      await shareAsync(docxUri, {
        UTI: ".docx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      console.log("DOCX shared successfully!");
    } catch (error) {
      console.error("Error converting PDF to DOCX:", error);
    }
  };

  return (
    <View style={styles.container}>
      {fileUri === null ? (
        <>
          <Text style={styles.message}>Choose a PDF to convert to DOCX</Text>
          <Button onPress={pickDocument} title="Select PDF" />
        </>
      ) : (
        <>
          <Text style={styles.message}>Selected PDF: {fileName}</Text>
          <Button
            onPress={convertToDoc}
            title={isConverting ? "Converting..." : "Convert to DOCX"}
            disabled={isConverting}
          />
        </>
      )}
    </View>
  );
};

export default PdfToDocView;

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
