// const axios = require("axios");
// const fs = require("fs");
// const pdfshift = require("pdfshift")("ac63e19351254b2b8ee5025ad7a8d41f");

const api_key = "ac63e19351254b2b8ee5025ad7a8d41f";

// export default function pdf() {
//   pdfshift
//     .convert("ac63e19351254b2b8ee5025ad7a8d41f", {
//       source: "https://www.example.com",
//       filename: "result.pdf",
//     })
//     .then(function (response) {
//       // The URL is on
//       console.log(response.data.url);
//     })
//     .catch(function ({ message, code, response, errors = null }) {});
// }

const axios = require("axios");
const fs = require("fs");

export default function pdfshift(api_key, data) {
  return new Promise((resolve, reject) => {
    let asJson = false;
    if ("filename" in data || "webhook" in data) {
      asJson = true;
    }

    axios
      .request({
        method: "post",
        url: "https://api.pdfshift.io/v3/convert/pdf",
        responseType: asJson ? "json" : "arraybuffer",
        data: data,
        auth: { username: "api", password: api_key },
      })
      .then(resolve)
      .catch((response) => {
          console.log('THE RSP', response)
        // Handle any error that might have occured
        reject(response);
      });
  });
}

// Here's a sample of what to do
pdfshift('your_api_key', { source: 'https://www.example.com' }).then(response => {
    console.log("uerl", response.data.url);
  fs.writeFileSync('example.com.pdf', response.data, "binary", function () {})
})