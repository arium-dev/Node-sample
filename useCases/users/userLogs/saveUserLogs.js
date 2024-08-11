const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const { UserLog } = require("../../../models/UserLog");

const getLanguages = (geolocation) => {
  let language = "";
  geolocation &&
    geolocation.location &&
    geolocation.location.languages &&
    geolocation.location.languages.forEach((lan) => {
      if (language) language += ", ";
      language += lan.name;
    });
  return language;
};

const getLocation = (geolocation) => {
  return geolocation &&
    geolocation.city &&
    geolocation.region_name &&
    geolocation.country_name
    ? `${geolocation.city} ${geolocation.region_name} ${geolocation.country_name}`
    : geolocation && geolocation.region_name && geolocation.country_name
    ? `${geolocation.region_name} ${geolocation.country_name}`
    : geolocation && geolocation.country_name
    ? geolocation.country_name
    : "";
};

const getOS = (os) => {
  return (os && os.name) || "";
};

const getDevice = (device) => {
  return device && device.vendor && device.model
    ? `${device.vendor} ${device.model}`
    : device && device.vendor
    ? device.vendor
    : device && device.model
    ? device.model
    : "";
};

const getBrowser = (browser) => {
  return (browser && browser.name) || "";
};

/**
 * User Log Entry
 */
const addUserLog = async (
  user,
  userLogRepository,
  log,
  geolocationInfo,
  existingGeolocationInfo,
  ip
) => {
  try {
    const languages =
      existingGeolocationInfo?.language || getLanguages(geolocationInfo);
    const location =
      existingGeolocationInfo?.location || getLocation(geolocationInfo);

    const userLog = new UserLog({
      ip,
      os: getOS(log?.os),
      device: getDevice(log?.device),
      browser: getBrowser(log?.browser),
      language: languages,
      region:
        existingGeolocationInfo?.region || geolocationInfo?.region_name || "",
      location: location,
      userId: new ObjectId(user.id),
    });

    let data = await userLogRepository.save(userLog);

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
module.exports = { addUserLog };
