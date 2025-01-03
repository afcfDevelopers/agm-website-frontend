// utils.js
export const handleLinkClick = (campus, getSpecificCampusAvs, setCampusAcronym, fetchCampusReports, setWelcomeReport, setRevivalReport, setError, fetchCampusImages, fetchHistoricalImages) => {
    getSpecificCampusAvs(campus);
    setCampusAcronym(campus);
    fetchCampusReports(campus, setWelcomeReport, setRevivalReport, setError);
    fetchCampusImages(campus);
    fetchHistoricalImages(campus);
  };
  