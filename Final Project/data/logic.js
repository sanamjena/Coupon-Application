const mongoCollections = require("../config/mongoCollections");
const MongoClient = require("mongodb").MongoClient;
const users = mongoCollections.users;
const likes = mongoCollections.likes;

async function create(firstname, lastname, emailId, gender, city, state) {
    if (!firstname) throw "You must provide a name for your animal";
    if (
        Number.isInteger(firstname) ||
        Number.isInteger(lastname) ||
        Number.isInteger(gender) ||
        Number.isInteger(city) ||
        Number.isInteger(state)
    ) {
        throw "Please enter a valid input. Either the first name or the animal type is of type number";
    }
    if (typeof animalType == "object") {
        if (animalType.length > 1) throw "You can provide only one breed.";
        animalType = animalType[0];
    }

    const animalCollection = await animals();

    let newAnimal = {
        name: name,
        animalType: animalType
    };

    const insertInfo = await animalCollection.insertOne(newAnimal);
    if (insertInfo.insertedCount === 0) throw "Could not add Animal";

    const newId = insertInfo.insertedId.toString();

    const animal = await get(newId);
    return animal;
}