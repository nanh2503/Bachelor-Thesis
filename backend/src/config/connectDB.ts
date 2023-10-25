import mongoose from "mongoose";

const databaseConnect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Connect to MongoDB successfully")
    }).catch(err => {
        console.log(err)
    })
}

// const question3 = new Blog({
//     id: 5,
//     question: "Rows and silences are ______ and parcel of any marriage.",
//     options: {
//         A: 'package',
//         B: 'stamps',
//         C: 'packet',
//         D: 'part'
//     },
//     answer: null,
//     trueAnswer: "D",
// })

// question3.save()

// const answer = new Test({
//     answer: "test",
// })

// answer.save()

module.exports = databaseConnect;