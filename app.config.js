module.exports = {
  expo: {
    name: "ExcelSoft App",
    slug: "excelsoft-app",
    // ... (keep all existing app.json configurations)
    android: {
      // ... (keep existing android configurations)
      buildProperties: {
        kotlinVersion: "1.9.25" // Update Kotlin version
      }
    }
  }
};
