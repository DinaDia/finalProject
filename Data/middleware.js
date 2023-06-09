const Geocoder = require('nominatim-geocoder');
const geocoder = new Geocoder();

module.exports.geocode=async (address)=> {
      const response = await geocoder.search({ q: address, limit: 1 });
      if (response.length > 0) {
        const result = response[0];
        return {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon)
        };
      } else {
        return null;
      }
  }
  module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
    //   req.session.returnTo=req.originalUrl
    //   return res.redirect("/farmer/login");
    res.status(402)
    throw new Error("please login")
    }
    // req.user=user
    next()
  };