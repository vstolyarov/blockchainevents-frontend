const functions = require('firebase-functions');
const admin = require('firebase-admin');

const moment = require('moment');
const slugify = require('slugify');
const NodeGeocoder = require('node-geocoder');
const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: functions.config().google.apikey
});

module.exports = functions.https.onRequest((req, res) => {
  const newEventData = Object.assign({}, req.query, req.body);
  if (!newEventData.city) {
    return res.status(500).send('Bad request, bro.')
  }
  const { hours, minutes} = moment(newEventData.time, 'Hmm').toObject()
  newEventData.when = moment(newEventData.when).set({hours, minutes}).toDate()
  newEventData.userinputCity = newEventData.city;
  newEventData._approved = false;

  return geocoder.geocode(newEventData.city, (err, geo) => {
    if (err) { console.error(err); }
    geo1 = geo[0] || geo || {};
    newEventData.formattedCity = geo1.formattedAddress;
    newEventData.city = geo1.city || newEventData.city;
    if (geo1.administrativeLevels && geo1.administrativeLevels.level1long) {
      newEventData.state = geo1.administrativeLevels.level1long;
    }
    newEventData.geopointCity = new admin.firestore.GeoPoint(geo1.latitude, geo1.longitude);
    newEventData.country = geo1.country;
    newEventData['~geocoded'] = geo;

    newEventData.slug = slugify(newEventData.title)

    const newEventRef = admin.firestore().collection('events').doc();
    return newEventRef.set(newEventData).then((a,b,c) => {
      return res.status(200).send(a);
    })
  })
})
