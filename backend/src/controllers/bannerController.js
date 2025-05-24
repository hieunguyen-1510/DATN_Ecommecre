import Banner from '../models/bannerModel.js';
import User from '../models/userModel.js';
import validator from 'validator';

// GET all banners 
export const getAllBanners = async (req, res) => {
    try {
        const { page = 1, limit = 10, position, isActive } = req.query;
        const filter = {};
        if (position) filter.position = position;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const banners = await Banner.find(filter)
            .populate('createdBy', 'name email')
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalBanners = await Banner.countDocuments(filter);

        res.status(200).json({
            data: banners,
            pagination: {
                total: totalBanners,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalBanners / limit),
            },
        });
    } catch (err) {
        res.status(500).json({ error: 'Cannot fetch banners', details: err.message });
    }
};

// GET banner by ID
export const getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id).populate('createdBy', 'name email');
        if (!banner) return res.status(404).json({ message: 'Banner not found' });
        res.status(200).json(banner);
    } catch (err) {
        res.status(500).json({ error: 'Cannot fetch banner', details: err.message });
    }
};

// POST create banner
export const createBanner = async (req, res) => {
    try {
        const { title, imageUrl, targetUrl, position, order, startDate, endDate, description, isActive } = req.body;
        const createdBy = req.body.createdBy || req.user._id;

        if (!title || !imageUrl || !position) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (!validator.isURL(imageUrl)) {
            return res.status(400).json({ error: 'Invalid image URL' });
        }
        const userExists = await User.findById(createdBy);
        if (!userExists) {
            return res.status(400).json({ error: 'Invalid User ID' });
        }

        const newBanner = new Banner({
            title, imageUrl, targetUrl, position, order, startDate, endDate, description, createdBy, isActive
        });
        const savedBanner = await newBanner.save();
        const populatedBanner = await Banner.findById(savedBanner._id).populate('createdBy', 'name email');
        res.status(201).json(populatedBanner);
    } catch (err) {
        res.status(400).json({ error: 'Cannot create banner', details: err.message });
    }
};

// PUT update banner
export const updateBanner = async (req, res) => {
    try {
        const { title, imageUrl, targetUrl, position, order, startDate, endDate, description, isActive } = req.body;
        if (!title || !imageUrl || !position) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (!validator.isURL(imageUrl)) {
            return res.status(400).json({ error: 'Invalid image URL' });
        }

        const updatedBanner = await Banner.findByIdAndUpdate(
            req.params.id,
            { title, imageUrl, targetUrl, position, order, startDate, endDate, description, isActive },
            { new: true, runValidators: true }
        );
        if (!updatedBanner) {
            return res.status(404).json({ message: 'Banner not found' });
        }
        const populatedBanner = await Banner.findById(updatedBanner._id).populate('createdBy', 'name email');
        res.status(200).json(populatedBanner);
    } catch (err) {
        res.status(400).json({ error: 'Cannot update banner', details: err.message });
    }
};

// DELETE banner
export const deleteBanner = async (req, res) => {
    try {
        const deletedBanner = await Banner.findByIdAndDelete(req.params.id);
        if (!deletedBanner) {
            return res.status(404).json({ message: 'Banner not found' });
        }
        res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Cannot delete banner', details: err.message });
    }
};

// PUT activate banner 
export const activateBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ message: 'Banner not found' });

        // Đảm bảo chỉ một banner active cho mỗi vị trí
        await Banner.updateMany({ position: banner.position }, { isActive: false });

        banner.isActive = true;
        const savedBanner = await banner.save(); // Lưu thay đổi trước

        // Populate createdBy trước khi trả về
        const populatedBanner = await Banner.findById(savedBanner._id).populate('createdBy', 'name email');

        res.json({ message: 'Banner activated', banner: populatedBanner }); // Trả về banner đã populate
    } catch (err) {
        res.status(500).json({ error: 'Cannot activate banner', details: err.message });
    }
};

// PUT deactivate banner
export const deactivateBanner = async(req,res) =>{
    try {
        const banner = await Banner.findById(req.params.id);
        if(!banner) return res.status(404).json({message: "Banner not found!"});

        banner.isActive = false;
        await banner.save();

        // Tra ve banner da duoc kich hoat
        const populatedBanner = await Banner.findById(banner._id).populate("createdBy", "name email");
        res.status(200).json({message: "Banner deactivated!", banner: populatedBanner })

    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Cannot deactivated banner!", details: err.message})
        
    }
}

// GET public banners 
export const getPublicBanners = async (req, res) => {
    try {
        const { position } = req.query; 
        const filter = { isActive: true }; // Luôn chỉ lấy banner đang active

        if (position) filter.position = position;

        const banners = await Banner.find(filter)
            .sort({ order: 1, createdAt: -1 }) 
            .limit(10); 

        res.status(200).json(banners); // Trả về trực tiếp mảng banner
    } catch (err) {
        res.status(500).json({ error: 'Cannot fetch public banners', details: err.message });
    }
};