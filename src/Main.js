import React from "react";
import { Route, Routes } from "react-router-dom";
import NIHDatabaseContainer from "./containers/NIH_dietary_supplement_label_database";

export default function Main() {
  return (
    <Routes>
      <Route path="/nih-label-comparison" element={<NIHDatabaseContainer />} />
      <Route path="*" element={<NIHDatabaseContainer />} />
    </Routes>
  );
}
