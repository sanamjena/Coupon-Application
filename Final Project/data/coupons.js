const mongoCollections = require("../config/mongoCollections");
const MongoClient = require("mongodb").MongoClient;
const coupons = mongoCollections.coupons;
const { ObjectId } = require(mongodb);

const connection = require("./mongoConnection");

async function get(id) {
  if (!id) throw "No ID was given.";
  const couponCollection = await coupons();
  const target_coupon = await couponCollection.findOne({ _id: id });
  if (target_coupon === null) throw `There's no coupon with the ID: ${id}.`;
  return target_coupon;
}

async function create(description, expiration_date, code) {
  //   if (!product) throw "No product was given.";
  //   if (typeof product !== "string") throw `${product} is not a string.`;
  if (!code) throw "No code was given.";
  if (typeof code !== "string") throw `${code} is not a string.`;
  if (!expiration_date) throw "No expiration date was given.";
  if (typeof expiration_date !== "string")
    throw `${expiration_date} is not a string.`;
  const couponCollection = await coupons();
  //likes: an array of user ID's that have liked the coupon
  //dislikes: an array of user ID's that have disliked the coupon
  //rating: # of likes / # of likes + # of dislikes **RATING WILL BE DISPLAYED ON A SCALE FROM 0 - 10**
  //comments: an array of objects with fields of User ID and the comment itself
  let newCoupon = {
    // product: product,
    description: description,
    expiration_date: expiration_date,
    code: code,
    likes: [],
    dislikes: [],
    rating: 0,
    comments: []
  };
  const insertInfo = await couponCollection.insertOne(newCoupon);
  if (insertInfo.insertedCount === 0)
    throw "The coupon was unable to be added.";
  const newId = insertInfo.insertedId;
  return await get(newId);
}

async function rating(coupon_id) {
  if (!coupon_id) throw "No coupon ID was given.";
  const targetCoupon = await get(coupon_id);
  let rating =
    10 *
    (
      targetCoupon["likes"].length /
      (targetCoupon["likes"].length + targetCoupon["dislikes"].length)
    ).toFixed(1);
  const updatedInfo = await couponCollection.updateOne(
    { _id: coupon_id },
    { $set: { rating: rating } }
  );
  if (updatedInfo.modifiedCount === 0)
    throw "The coupon was unable to be updated.";
  return targetCoupon;
}

async function addLike(coupon_id, user_id) {
  if (!coupon_id) throw "No coupon ID was given.";
  if (!user_id) throw "No user ID was given.";
  const couponCollection = await coupons();
  const updatedInfo = await couponCollection.insert(
    { _id: coupon_id },
    { $push: { likes: user_id } }
  );
  if (updatedInfo.modifiedCount === 0)
    throw "The coupon was unable to be updated.";
  return await get(coupon_id);
}

async function addDislike(coupon_id, user_id) {
  if (!coupon_id) throw "No coupon ID was given.";
  if (!user_id) throw "No user ID was given.";
  const couponCollection = await coupons();
  const updatedInfo = await couponCollection.insert(
    { _id: coupon_id },
    { $push: { dislikes: user_id } }
  );
  if (updatedInfo.modifiedCount === 0)
    throw "The coupon was unable to be updated.";
  return await get(coupon_id);
}

async function addComment(coupon_id, user_id, comment) {
  if (!coupon_id) throw "No coupon ID was given.";
  if (!user_id) throw "No user ID was given.";
  if (!comment) throw "No comment was given.";
  const couponCollection = await coupons();
  let commentObj = { userId: user_id, comment: comment };
  const updatedInfo = await couponCollection.update(
    { _id: coupon_id },
    { $push: { commentObj } }
  );
  if (updatedInfo.modifiedCount === 0)
    throw "The comment was unable to be updated.";
  return await get(coupon_id);
}

module.exports = {
  get,
  create,
  rating,
  addLike,
  addDislike,
  addComment
};

const main = async () => {
  await create("30% off Everything Photo", "12/28/2019", "THIRTYALL");
  await create(
    "25% off Contact Lenses + Free Shipping",
    "12/31/2019",
    "RAKUTEN25"
  );
  await create(
    "60% off Wood Panels + Same Day Pickup",
    "12/10/2019",
    "WOODPL2"
  );
  await create("Extra 10% off Sleek Makeup", "12/31/2019", "SLEEK");
  await create(
    "60% off Wood Hanger Board Print and Wood Panel + Same Day Pickup",
    "12/14/2019",
    "SIXTYHBP"
  );
  await create("50% off Photo Orders $60+", "12/28/2019", "SIXTY5");
  await create(
    "15% off $30+ select Health Care items",
    "12/14/2019",
    "SAVING15"
  );
  await create("75% off HurryRoll Rollator", "12/14/2019", "HURRY75");
  await create(
    "Extra 20% off Hair Care when you spend $50+",
    "12/14/2019",
    "GET20"
  );

  const db = await connection();
  await db.serverConfig.close();
};

main().catch(error => {
  console.log(error);
});
