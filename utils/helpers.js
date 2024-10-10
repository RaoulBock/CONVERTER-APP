export const performOCR = async (file) => {
  let myHeaders = new Headers();
  myHeaders.append(
    "apikey",

    // ADDD YOUR API KEY HERE
    "FEmvQr5uj99ZUvk3essuYb6P5lLLBS20"
  );
  myHeaders.append("Content-Type", "multipart/form-data");

  let raw = file;
  let requestOptions = {
    method: "POST",
    redirect: "follow",
    headers: myHeaders,
    body: raw,
  };

  try {
    const response = await fetch(
      "https://api.apilayer.com/image_to_text/upload",
      requestOptions
    );
    const result = await response.json();

    return result["all_text"];
  } catch (err) {
    console.log(err);
  }
};
