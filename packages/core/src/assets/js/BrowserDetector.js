class BrowserDetector {
  constructor() {
    this._dataBrowser = [
      { string: navigator.userAgent, subString: "Edge", identity: "Edge" },
      { string: navigator.userAgent, subString: "MSIE", identity: "Explorer" },
      {
        string: navigator.userAgent,
        subString: "Trident",
        identity: "Explorer"
      },
      {
        string: navigator.userAgent,
        subString: "Firefox",
        identity: "Firefox"
      },
      { string: navigator.userAgent, subString: "Opera", identity: "Opera" },
      { string: navigator.userAgent, subString: "OPR", identity: "Opera" },

      { string: navigator.userAgent, subString: "Chrome", identity: "Chrome" },
      { string: navigator.userAgent, subString: "Safari", identity: "Safari" }
    ];

    this.browser = this.searchString(this._dataBrowser) || "Other";
    this._version =
      this.searchVersion(navigator.userAgent) ||
      this.searchVersion(navigator.appVersion) ||
      "Unknown";

    return {
      browser: this.browser.toLowerCase(),
      version: this._version
    };
  }

  searchString(data) {
    for (let i = 0; i < data.length; i++) {
      const dataString = data[i].string;
      this._versionSearchString = data[i].subString;

      if (dataString.indexOf(data[i].subString) !== -1) {
        return data[i].identity;
      }
    }
  }

  searchVersion(dataString) {
    const index = dataString.indexOf(this._versionSearchString);
    if (index === -1) {
      return;
    }

    const rv = dataString.indexOf("rv:");
    if (this._versionSearchString === "Trident" && rv !== -1) {
      return parseFloat(dataString.substring(rv + 3));
    } else {
      return parseFloat(
        dataString.substring(index + this._versionSearchString.length + 1)
      );
    }
  }
}

export default BrowserDetector;
