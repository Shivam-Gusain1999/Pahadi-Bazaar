

// add address //

import Address from "../models/Address.js"

export const addAddress = async(req, res)=>{
    try {
        const {address} = req.body
        const userId = req.user.id;
        
        await Address.create({...address, userId})
        res.json({success:true, message: "address added successfully"})
        
    } catch (error) {
          console.log(error.message)
            res.json({ success: false, message: error.message });   
    }
}

//get address// 

export const getAddress = async (req, res) => {
  try {
    const userId = req.user.id;                
    const addresses = await Address.find({ userId });  

    res.json({ success: true, addresses });     
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
