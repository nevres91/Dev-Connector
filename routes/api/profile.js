const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/user');
const request = require('request')
const config = require('config')



// @route    GET api/profile/me (to get only our profile)
// @desc     Get current user's profile 
// @access   Private    
router.get('/me', auth, async (req, res) =>
{ // bring in auth and add it as second parrameter to protect the route
  try
  {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']); // the 'user' is gonna pretain to our profile model 'user' field which is gonna be the ObjectId of the user.

    if (!profile)
    {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err)
  {
    console.err(err.message);
    res.status(500).send('Server Error')
  }
});

// @route    POST api/profile/
// @desc     Create or update a user profile
// @access   Private 

router.post('/', [auth, [
  check('status', 'Status is required')   // Checking for errors
    .not()
    .isEmpty(),
  check('skills', 'Skills is required').not().isEmpty()
]], async (req, res) =>
{
  const errors = validationResult(req);
  if (!errors.isEmpty())
  {
    return res.status(400).json({ errors: errors.array() });
  }
  const {    // pulling all the fields from req.body
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;

  //Build profile object
  const profileFields = {};  // We build this profileFields object to insert into the database
  profileFields.user = req.user.id;
  if (company) profileFields.company = company; // we need to check to see if the stuff is actually comming in before we set it
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  if (skills)
  {
    profileFields.skills = skills.split(',').map(skill => skill.trim()); // we get back an array
  }

  //Build social object
  profileFields.social = {}
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;

  try
  {
    let profile = await Profile.findOne({ user: req.user.id })  // look for the profile by the user

    if (profile)
    {
      //Update    //if its found we're gonna update it
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(profile); // and send back the profile
    }
    // Create
    profile = new Profile(profileFields); // if it snot found, we're just gonna create it

    await profile.save(); // save it
    res.json(profile); // and send back the profile
  } catch (err)
  {
    console.err(err.message)
    res.status(500).send('Server Error')
  }
}
);

// @route    GET api/profile/
// @desc     Get all profiles
// @access   Public 

router.get('/', async (req, res) =>
{
  try
  {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err)
  {
    console.err(err.message);
    res.status(500).send('Server Error')
  }

})

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public 

router.get('/user/:user_id', async (req, res) =>
{
  try
  {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']); //id comes from url...

    if (!profile) return res.status(400).json({ msg: 'Profile not found' })
    return res.json(profile); //added return

  } catch (err)
  {
    console.error(err.message);
    if (err.kind == 'ObjectId')
    {
      return res.status(400).json({ msg: 'Profile not found' })
    }
    res.status(500).send('Server Error')
  }
})

// @route    DELETE api/profile/
// @desc     delete profile, user & posts
// @access   Private 

router.delete('/', auth, async (req, res) =>
{
  try
  {
    // @todo - remove users posts
    // Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove the user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err)
  {
    console.err(err.message);
    res.status(500).send('Server Error')
  }

})

// @route    PUT api/profile/experience
// @desc     add profiel experience
// @access   Private 

router.put('/experience', [auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty(),
]], async (req, res) =>
{
  const errors = validationResult(req);
  if (!errors.isEmpty())
  {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body

  const newExp = {  // this will create an object with the data that the user submits.
    title,
    company, //this is same as above
    location,
    from,
    to,
    current,
    description
  }

  try
  {
    const profile = await Profile.findOne({ user: req.user.id });// We wanna first fetch the profile we wanna add experience to.

    profile.experience.unshift(newExp); // unshift same as push
    await profile.save();
    res.json(profile);
  } catch (err)
  {
    console.error(err.message);
    res.status(500).send('Server Error');
  }


})

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private 

router.delete('/experience/:exp_id', auth, async (req, res) =>
{
  try
  {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id) //'req.params.exp_id' --link endpoint

    profile.experience.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);

  } catch (err)
  {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

// @route    PUT api/profile/education
// @desc     add profiel education
// @access   Private 

router.put('/education', [auth, [
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'Degree is required').not().isEmpty(),
  check('fieldofstudy', 'Field of study is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty(),
]], async (req, res) =>
{
  const errors = validationResult(req);
  if (!errors.isEmpty())
  {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body

  const newEdu = {  // this will create an object with the data that the user submits.
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }

  try
  {
    const profile = await Profile.findOne({ user: req.user.id });// We wanna first fetch the profile we wanna add experience to.

    profile.education.unshift(newEdu); // unshift same as push
    await profile.save();
    res.json(profile);
  } catch (err)
  {
    console.error(err.message);
    res.status(500).send('Server Error');
  }


})

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private 

router.delete('/education/:edu_id', auth, async (req, res) =>
{
  try
  {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id) //'req.params.edu_id' --link endpoint

    profile.education.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);

  } catch (err)
  {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

// @route    GET api/profile/github/:username
// @desc     Get user repos from github
// @access   Public

router.get('/github/:username', (req, res) =>
{
  try
  {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    request(options, (error, response, body) =>
    {
      if (error) console.error(error);

      if (response.statusCode !== 200)
      {
        return res.status(404).json({ msg: 'No github profile found' });

      }
      res.json(JSON.parse(body));
    })
  } catch (err)
  {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
})


module.exports = router;