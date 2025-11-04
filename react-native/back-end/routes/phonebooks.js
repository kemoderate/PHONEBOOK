var express = require('express');



module.exports = (db) => {

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



router.post('/', async (req, res) => {
    try {
      const { name, phone } = req.body;
      const newContact = {
        name,
        phone,
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: null
      }
      const result = await phonebooks.insertOne(newContact);
      res.status(201).json({id: result.insertedId,...newContact,});
    } catch (err) {
      res.status(500).json({ error: err.message });
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

    const result = await phonebooks.updateOne(({_id}),updatedContact)
    res.status(201).json({id, result})
  }catch(err){
    res.status(500).json({error: err.message})
  }
})

router.put('/edit/:id/avatar', async (req,res) => {
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
  res.json 
}catch(err){
res.status(500).json({error: err.message});
}
})


router.delete('/delete/:id', async (req, res) => {
  try{
    const id = req.params.id
    const _id = new ObjectId(id);
    const result = await phonebooks.deleteOne({_id});
    res.status(200).json({deleteCount : result.deleteCount})

  }catch(err){
    res.status(500).json({error:err.message})
  }

})

return router
}
