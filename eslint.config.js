// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    // Modul 2 mengajarkan pola setState di dalam useEffect (sama seperti contoh aplikasi asisten).
    // Aturan ini menolak pola itu, jadi dimatikan supaya cek lint di GitHub tetap hijau.
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);
