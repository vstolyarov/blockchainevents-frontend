const functions = require('firebase-functions');
const admin = require('firebase-admin');

const { subscribeToList } = require('./mailgun.js')
const NodeGeocoder = require('node-geocoder');
const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: functions.config().google.apikey
});


module.exports = functions.firestore
.document('/eventNewsletterSubscribers/{documentId}')
.onCreate((snapshot, context) => {
  const { city, email } = snapshot.data();

  return geocoder.geocode(city, (err, geo) => {
    if (err) { console.error(err); }
    geo1 = geo[0] || geo || {};
    let location = {
      formattedCity: geo1.formattedAddress,
      city: geo1.city || city,
    }
    if (geo1.administrativeLevels && geo1.administrativeLevels.level1long) {
      location.state = geo1.administrativeLevels.level1long;
    }
    location.geopointCity = new admin.firestore.GeoPoint(geo1.latitude, geo1.longitude);
    location.country = geo1.country;
    location['~geocoded'] = geo;

    subscribeToList({email, city: location.formattedCity})

    return snapshot.ref.set(location, {merge: true})
  })
});
