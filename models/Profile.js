const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, //we wanna creat a refference to User model, because every profile should be associated with the user
    ref: 'user'
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String], // an array of strings, we'll use js to turn it into an array and put it into our database.
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  experience: [{
    title: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    location: {
      type: String
    },
    from: {
      type: Date,
      required: true
    },
    to: {
      type: Date
    },
    current: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    }
  }
],
education: [{
  school: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  fieldofstudy: {
    type: String,
    required: true
  },
  from: {
    type: Date,
    required: true
  },
  to: {
    type: String
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String
  },
}
],
social: {
  youtube: {
    type: String
  },
  twitter: {
    type: String
  },
  facebook: {
    type: String
  },
  linkedin: {
    type: String
  },
  instagram: {
    type: String
  }
},
date: {
  type: Date,
  default: Date.now
}
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
// Now we should be able to bring this profile model into our profile routes and query the database (get profiles, create them, update...)