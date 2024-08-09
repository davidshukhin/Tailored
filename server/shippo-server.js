
// Create address object
const shippo = new Shippo({apiKeyHeader: 'shippo_test_4e55769e66efcfbf5464a3452e65ce69d97f0589'});
const addressFrom = await shippo.addresses.create({
    name: "Shawn Ippotle",
    company: "Shippo",
    street1: "215 Clayton St.",
    city: "San Francisco",
    state: "CA",
    zip: "94117",
    country: "US", // iso2 country code
    phone: "+1 555 341 9393",
    email: "shippotle@shippo.com",
});
