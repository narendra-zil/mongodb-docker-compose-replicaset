const { foodSchema }   = require('./models/food')
const { drinkSchema } = require('./models/drink')

const mongoose = require('mongoose')

const uri = 'mongodb://root:rootpassword@$localhost:30001,localhost:30002,localhost:30003/test-db?authSource=admin&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false';

const saveFoodAndDrink = async () => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction()
        await foodSchema.create([{name:'Tacos'}], {session})
        await drinkSchema.create([{name:'Coke'}], {session})

        await session.commitTransaction()
        session.endSession()
    }catch(e){
        await session.abortTransaction()
        session.endSession()
        console.log('Error encountered in saveFoodAndDrink ', e)
    }
}

const saveFoodAndDrinkWithRollback = async () => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction()
        await foodSchema.create([{name:'Tacos'}], {session})
        throw Error('invalid');
        await drinkSchema.create([{name:'Coke'}], {session})

        await session.commitTransaction()
        session.endSession()
    }catch(e){
        await session.abortTransaction()
        session.endSession()
        console.log('Error encountered in saveFoodAndDrink ', e)
    }
}


const readFoodAndDrink = async () => {
    try{
        const foods = await foodSchema.find();
        console.log(`foods : ${JSON.stringify(foods)}`)

        const drinks = await drinkSchema.find();
        console.log(`drinks : ${JSON.stringify(drinks)}`)
    }catch(e){
        console.log('Error encountered in readFoodAndDrink ', e)
    }
}

const clearFoodAndDrink = async () => {
    try{
        await foodSchema.deleteMany();
        await drinkSchema.deleteMany();
    }catch(e){
        console.log('Error encountered in clearFoodAndDrink ', e)
    }
}

(async () => {
    try {
        console.log('creating connection')
        const connectionRes = await mongoose.connect(uri);

        // If collection does not exist then it is required to call createCollection() when working with replica sets.
       // await drinkSchema.createCollection();
       // await foodSchema.createCollection();

       console.log(`Database state before`)
       await readFoodAndDrink();

       //await clearFoodAndDrink();
       await saveFoodAndDrink();

       // await saveFoodAndDrinkWithRollback();

        console.log(`Database state after`)
        await readFoodAndDrink();
    } catch (e) {
        console.log('Error encountered !!', e)
    }
})()