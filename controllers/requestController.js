import Request from '../models/Request.js';

// @desc    Get all requests with pagination and search
// @route   GET /api/requests
// @access  Private
export const getRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = {};
    
    if (search && search.trim()) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Get total count
    const count = await Request.countDocuments(query);

    // Get paginated data
    const requests = await Request.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(count / limitNum),
      data: requests
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلبات'
    });
  }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
export const getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلب'
    });
  }
};

// @desc    Create new request
// @route   POST /api/requests
// @access  Public
export const createRequest = async (req, res) => {
  try {
    const { name, phone, storeUrl, monthlySales, ipAddress, country, phoneCountry } = req.body;

    // Validate required fields
    if (!name || !phone || !storeUrl || !monthlySales) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول مطلوبة'
      });
    }

    const request = await Request.create({
      name,
      phone,
      storeUrl,
      monthlySales,
      ipAddress,
      country,
      phoneCountry
    });

    res.status(201).json({
      success: true,
      message: 'تم إرسال الطلب بنجاح',
      data: request
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء الطلب'
    });
  }
};

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private
export const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    await Request.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'تم حذف الطلب بنجاح'
    });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف الطلب'
    });
  }
};

// @desc    Export all requests
// @route   GET /api/requests/export
// @access  Private
export const exportRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Export requests error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تصدير الطلبات'
    });
  }
};
