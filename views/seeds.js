// const mongoose = require("mongoose");
const Campground = require("../models/campground");
// const Comment = require("../models/comment");

// data = [
//     {
//         name: "Cloud's Rest",
//         image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//         description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Adipisci quas velit quisquam vel hic! Nisi ab tempore incidunt omnis quod, ipsum possimus tempora, vel culpa officiis quidem rem corporis vitae nemo unde placeat. Sint cumque earum exercitationem maxime ipsam asperiores suscipit quae. In amet eveniet nam aut odit sed consequuntur?Lorem ipsum dolor, sit amet consectetur adipisicing elit. Adipisci quas velit quisquam vel hic! Nisi ab tempore incidunt omnis quod, ipsum possimus tempora, vel culpa officiis quidem rem corporis vitae nemo unde placeat. Sint cumque earum exercitationem maxime ipsam asperiores suscipit quae. In amet eveniet nam aut odit sed consequuntur?"
//     },
//     {
//         name: "Bounty Rest",
//         image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//         description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Adipisci quas velit quisquam vel hic! Nisi ab tempore incidunt omnis quod, ipsum possimus tempora, vel culpa officiis quidem rem corporis vitae nemo unde placeat. Sint cumque earum exercitationem maxime ipsam asperiores suscipit quae. In amet eveniet nam aut odit sed consequuntur?Lorem ipsum dolor, sit amet consectetur adipisicing elit. Adipisci quas velit quisquam vel hic! Nisi ab tempore incidunt omnis quod, ipsum possimus tempora, vel culpa officiis quidem rem corporis vitae nemo unde placeat. Sint cumque earum exercitationem maxime ipsam asperiores suscipit quae. In amet eveniet nam aut odit sed consequuntur?"
//     },
//     {
//         name: "Sunny Mountains",
//         image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//         description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Adipisci quas velit quisquam vel hic! Nisi ab tempore incidunt omnis quod, ipsum possimus tempora, vel culpa officiis quidem rem corporis vitae nemo unde placeat. Sint cumque earum exercitationem maxime ipsam asperiores suscipit quae. In amet eveniet nam aut odit sed consequuntur?Lorem ipsum dolor, sit amet consectetur adipisicing elit. Adipisci quas velit quisquam vel hic! Nisi ab tempore incidunt omnis quod, ipsum possimus tempora, vel culpa officiis quidem rem corporis vitae nemo unde placeat. Sint cumque earum exercitationem maxime ipsam asperiores suscipit quae. In amet eveniet nam aut odit sed consequuntur?"
//     },
// ]

function seedDB() {
  Campground.deleteMany({}, (err, removed) => {
    console.log("comments are deleted");
  });
}
//     if(err){
//         console.log(err)
//     }else{
//         console.log("removed campgrounds!", removed)
//         data.forEach((seed) => {
//             Campground.create(seed, (err,data)=>{
//                 if(err){
//                     console.log(err);
//                 }else{
//                     console.log("added a campground");
//                     Comment.create({
//                         text: "This place is great, but I wish there was internet",
//                         author: "Homer"
//                     }, (err,comment)=>{
//                         if(err){
//                             console.log(err)
//                         }else{
//                             data.comments.push(comment);
//                             data.save()
//                             console.log("creaTED new comment")
//                         }
//                     })
//                 }
//             });
//         })
//     }
// })}

module.exports = seedDB();
