// 공통 CRUD 컨트롤러 헬퍼 함수들

// 목록 조회 (페이징, 검색, 필터링)
const getAll = (Model, modelName) => async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      status = 'published',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      media = '',
      dateFilter = ''
    } = req.query;

    // 검색 조건 구성
    const searchConditions = {
      status: status === 'all' ? { $in: ['draft', 'published'] } : status
    };

    if (search) {
      searchConditions.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      searchConditions.category = category;
    }

    // 언론사 필터링 (MediaCoverage 모델용)
    if (media && Model.modelName === 'MediaCoverage') {
      const knownMediaOutlets = [
        '연합뉴스', '뉴시스', '뉴스1', '조선일보', '조선비즈', '중앙일보', 
        '동아일보', '한국경제', '매일경제', '아시아투데이', '파이낸스투데이', 
        '한미일보', '천지일보', '트루스데일리', '매일신문'
      ];
      
      if (media === '기타') {
        // "기타"를 선택한 경우 - 알려진 언론사가 아닌 모든 것
        searchConditions.mediaOutlet = { $nin: knownMediaOutlets };
      } else {
        // 특정 언론사를 선택한 경우
        searchConditions.mediaOutlet = media;
      }
    }

    // 날짜 필터링 (MediaCoverage 모델용)
    if (dateFilter && Model.modelName === 'MediaCoverage') {
      const now = new Date();
      let startDate;
      
      switch (dateFilter) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        case '3months':
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          break;
      }
      
      if (startDate) {
        searchConditions.broadcastDate = { $gte: startDate };
      }
    }

    // 정렬 설정
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // 페이징 계산
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 데이터 조회
    const [items, total] = await Promise.all([
      Model.find(searchConditions)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Model.countDocuments(searchConditions)
    ]);

    // 응답 데이터 구성
    const response = {
      success: true,
      data: items,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        hasNext: skip + items.length < total,
        hasPrev: parseInt(page) > 1
      },
      message: items.length > 0 
        ? `${modelName} 목록을 조회했습니다` 
        : `등록된 ${modelName}가 없습니다. 새로운 ${modelName}이 등록되면 여기에 표시됩니다`
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${modelName} 목록 조회 중 오류가 발생했습니다`,
      error: error.message
    });
  }
};

// 단일 항목 조회
const getById = (Model, modelName) => async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await Model.findById(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `${modelName}를 찾을 수 없습니다`
      });
    }

    // 조회수 증가
    await Model.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: item,
      message: `${modelName}를 조회했습니다`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${modelName} 조회 중 오류가 발생했습니다`,
      error: error.message
    });
  }
};

// 새 항목 생성
const create = (Model, modelName) => async (req, res) => {
  try {
    const item = new Model(req.body);
    await item.save();

    res.status(201).json({
      success: true,
      data: item,
      message: `새로운 ${modelName}가 생성되었습니다`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `${modelName} 생성 중 오류가 발생했습니다`,
      error: error.message
    });
  }
};

// 항목 수정
const update = (Model, modelName) => async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await Model.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `${modelName}를 찾을 수 없습니다`
      });
    }

    res.json({
      success: true,
      data: item,
      message: `${modelName}가 수정되었습니다`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `${modelName} 수정 중 오류가 발생했습니다`,
      error: error.message
    });
  }
};

// 항목 삭제
const deleteById = (Model, modelName) => async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await Model.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `${modelName}를 찾을 수 없습니다`
      });
    }

    res.json({
      success: true,
      message: `${modelName}가 삭제되었습니다`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${modelName} 삭제 중 오류가 발생했습니다`,
      error: error.message
    });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteById
}; 