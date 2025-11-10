var express = require('express');


module.exports = (db,upload) => {

  const router = express.Router();
  const phonebooks = db.collection('phonebooks');
  const { ObjectId } = require('mongodb')


/* GET home page. */
router.get('/',async (req, res) => {
      try {
      let { page = 1, search = '',
        sortBy = 'name',
        sortMode = 'asc',
        limit = 5
      } = req.query;
      page = parseInt(page) || 1;
      limit = limit === 'all' ? 0 : parseInt(limit) || 5;
      const skip = limit === 0 ? 0 : (page - 1) * limit;

      let filter = {};
      if (search) {
        filter = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } }
          ]
        }
      }
      // sorting
      const sortOrder = sortMode === 'desc' ? -1 : 1;
      const sortOptions = {};

      const sortFields = sortBy.split(',');
      sortFields.forEach(field => {
        if (['name', 'phone'].includes(field.trim())) {
          sortOptions[field.trim()] = sortOrder;
        }
      });

      const totalUsers = await phonebooks.countDocuments(filter);
      const totalPages = limit ===  0 ? 1 : Math.ceil(totalUsers / limit);
      const data = await phonebooks.find(filter).sort(sortOptions).skip(skip).limit(limit).toArray();

      {
        return res.json({
          phonebooks: data,
          page,
          totalPages,
          limit,
          totalUsers,
          sortBy,
          sortMode,
          totalUsers
        })
      }
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
});



router.post('/',upload.single('avatar'), async (req, res) => {
    try {
      const { name, phone } = req.body;
      const avatarPath = req.file ? `/uploads/${req.file.filename}`: null;
      const newContact = {
        name,
        phone,
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: avatarPath,
      }
      const result = await phonebooks.insertOne(newContact);
      res.status(201).json({id: result.insertedId,...newContact,});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const contact = await db.collection('phonebooks').findOne({ _id: new ObjectId(id) });
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(contact);
  } catch (err) {
    console.error('Error fetching contact:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/edit/:id', async (req,res) => {
  try{  
    const id = req.params.id
    const _id = new ObjectId(id)
    const {name, phone,updatedAt,avatar} = req.body;
   const updatedContact = {
    $set:{
    name,
    phone,
    avatar: avatar || null,
    updatedAt
   }
   }

    const result = await phonebooks.updateOne({_id},updatedContact)
    res.status(201).json({id, result})
  }catch(err){
    res.status(500).json({error: err.message})
  }
})

router.put('/edit/:id/avatar', upload.single('avatar'), async (req,res) => {
  try{
  const id = req.params.id
  const _id = new ObjectId(id);
  const avatarPath = `/uploads/${req.file.filename}` 

  const result = await phonebooks.updateOne(
    {_id},
    {
      $set: {
        avatar: avatarPath,
        updatedAt: new Date()
      }
    }
  );
  res.json({message: 'avatar updated',result})
}catch(err){
res.status(500).json({error: err.message});
}
})


router.delete('/delete/:id', async (req, res) => {
  try{
    const id = req.params.id
    const _id = new ObjectId(id);
    const result = await phonebooks.deleteOne({_id});
    res.status(200).json({deletedCount : result.deletedCount})

  }catch(err){
    res.status(500).json({error:err.message})
  }

})

return router
}
