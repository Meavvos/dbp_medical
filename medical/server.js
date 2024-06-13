const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 각 구별 API URL 설정
const API_KEYS = {
    '부평구': 'https://api.odcloud.kr/api/15081738/v1/uddi:63879924-8a88-45d6-8496-87ed0c430c77?page=1&perPage=10&returnType=json&serviceKey=w%2BShgXNSUIKzeVycJUKSeTPybzJ9dn0n4%2BgeGBDIKnvfTZ7pvUHYLxRIE4LsYuZYWIaVYCrBQf1kyd2AuT2d6Q%3D%3D',
    '서구': 'https://api.odcloud.kr/api/15081671/v1/uddi:87c5f334-31ea-47e0-b3c9-9a42b22a9220?page=1&perPage=10&returnType=json&serviceKey=w%2BShgXNSUIKzeVycJUKSeTPybzJ9dn0n4%2BgeGBDIKnvfTZ7pvUHYLxRIE4LsYuZYWIaVYCrBQf1kyd2AuT2d6Q%3D%3D',
    '동구': 'https://api.odcloud.kr/api/15081509/v1/uddi:f1fbee8b-f726-44fc-b2e3-995ed13dad7b?page=1&perPage=10&returnType=json&serviceKey=w%2BShgXNSUIKzeVycJUKSeTPybzJ9dn0n4%2BgeGBDIKnvfTZ7pvUHYLxRIE4LsYuZYWIaVYCrBQf1kyd2AuT2d6Q%3D%3D',
    '계양구': 'https://api.odcloud.kr/api/15081495/v1/uddi:4cdaacf5-ba7c-4e66-be67-c6b549a45165?page=1&perPage=10&returnType=json&serviceKey=w%2BShgXNSUIKzeVycJUKSeTPybzJ9dn0n4%2BgeGBDIKnvfTZ7pvUHYLxRIE4LsYuZYWIaVYCrBQf1kyd2AuT2d6Q%3D%3D',
    '미추홀구': 'https://api.odcloud.kr/api/15081523/v1/uddi:a63a07c0-939d-4a6b-a7e2-8eda8ff80977?page=1&perPage=10&returnType=json&serviceKey=w%2BShgXNSUIKzeVycJUKSeTPybzJ9dn0n4%2BgeGBDIKnvfTZ7pvUHYLxRIE4LsYuZYWIaVYCrBQf1kyd2AuT2d6Q%3D%3D',
    '중구': 'https://api.odcloud.kr/api/15081555/v1/uddi:540b2391-8d89-48b8-95bc-be307b038413?page=1&perPage=10&returnType=json&serviceKey=w%2BShgXNSUIKzeVycJUKSeTPybzJ9dn0n4%2BgeGBDIKnvfTZ7pvUHYLxRIE4LsYuZYWIaVYCrBQf1kyd2AuT2d6Q%3D%3D'
};

// 병원별 네이버 지도 URL 매핑
const naverMapUrls = {
    '가톨릭대학교인천성모병원': 'https://map.naver.com/p/entry/place/36113634?lng=126.7249309&lat=37.4850686&placePath=%2Fhome&searchType=place&c=15.00,0,0,0,dh',
    '안은의료재단부평세림병원': 'https://map.naver.com/p/entry/place/13199748?lng=126.7199857&lat=37.5068719&placePath=%2Fhome&searchType=place&c=15.00,0,0,0,dh',
    '가톨릭관동대학교국제성모병원': 'https://map.naver.com/p/search/%EA%B0%80%ED%86%A8%EB%A6%AD%EA%B4%80%EB%8F%99%EB%8C%80%ED%95%99%EA%B5%90%EA%B5%AD%EC%A0%9C%EC%84%B1%EB%AA%A8%EB%B3%91%EC%9B%90/place/74643969?c=15.00,0,0,0,dh&placePath=%3Fentry%253Dbmp',
    '검단탑병원': 'https://map.naver.com/p/search/%EA%B2%80%EB%8B%A8%ED%83%91%EB%B3%91%EC%9B%90/place/13050769?c=15.00,0,0,0,dh&placePath=%3Fentry%253Dbmp',
    '의료법인루가의료재단나은병원': 'https://map.naver.com/p/search/%EC%9D%98%EB%A3%8C%EB%B2%95%EC%9D%B8%EB%A3%A8%EA%B0%80%EC%9D%98%EB%A3%8C%EC%9E%AC%EB%8B%A8%EB%82%98%EC%9D%80%EB%B3%91%EC%9B%90/place/969294994?c=15.00,0,0,0,dh&isCorrectAnswer=true',
    '온누리병원': 'https://map.naver.com/p/search/%EC%98%A8%EB%88%84%EB%A6%AC%EB%B3%91%EC%9B%90/place/13080648?c=15.00,0,0,0,dh&placePath=%3Fentry%253Dbmp',
    '의료법인성세의료재단뉴성민병원': 'https://map.naver.com/p/search/%EC%9D%98%EB%A3%8C%EB%B2%95%EC%9D%B8%EC%84%B1%EC%84%B8%EC%9D%98%EB%A3%8C%EC%9E%AC%EB%8B%A8%EB%89%B4%EC%84%B1%EB%AF%BC%EB%B3%91%EC%9B%90/place/11874752?c=15.00,0,0,0,dh&isCorrectAnswer=true',
    '인천광역시의료원': 'https://map.naver.com/p/entry/place/16395167?c=15.00,0,0,0,dh',
    '인천세종병원': 'https://map.naver.com/p/entry/place/1659325226?c=15.00,0,0,0,dh',
    '의료법인인성의료재단한림병원': 'https://map.naver.com/p/search/%EC%9D%98%EB%A3%8C%EB%B2%95%EC%9D%B8%EC%9D%B8%EC%84%B1%EC%9D%98%EB%A3%8C%EC%9E%AC%EB%8B%A8%ED%95%9C%EB%A6%BC%EB%B3%91%EC%9B%90/place/622073163?c=15.00,0,0,0,dh&isCorrectAnswer=true',
    '인천사랑병원': 'https://map.naver.com/p/search/%EC%9D%B8%EC%B2%9C%EC%82%AC%EB%9E%91%EB%B3%91%EC%9B%90/place/11559154?c=15.00,0,0,0,dh&placePath=%3Fentry%253Dbmp',
    '현대유비스병원': 'https://map.naver.com/p/search/%ED%98%84%EB%8C%80%EC%9C%A0%EB%B9%84%EC%8A%A4%EB%B3%91%EC%9B%90/place/12020177?c=15.00,0,0,0,dh&placePath=%3Fentry%253Dbmp',
    '인하대학교의과대학부속병원': 'https://map.naver.com/p/search/%EC%9D%B8%ED%95%98%EB%8C%80%ED%95%99%EA%B5%90%EC%9D%98%EA%B3%BC%EB%8C%80%ED%95%99%EB%B6%80%EC%86%8D%EB%B3%91%EC%9B%90/place/11686918?c=15.00,0,0,0,dh&isCorrectAnswer=true',
    '인천기독병원': 'https://map.naver.com/p/entry/place/13238191?c=15.00,0,0,0,dh'
};

// 병원별 사진 URL 매핑
const photoUrls = {
    '인천사랑병원': 'https://www.snua.or.kr/webdata/company/302z930z136zf7fz677z9f3z2b9ze32z52dz644z0d.jpg'
    // 다른 병원들의 사진 URL을 추가할 수 있습니다.
};

app.use(cors());
app.use(express.static('public'));

// 구별 데이터를 가져오는 엔드포인트
app.get('/fetch-data/:district', async (req, res) => {
    const district = req.params.district;
    const apiUrl = API_KEYS[district];

    if (!apiUrl) {
        return res.status(400).send('Invalid district');
    }

    try {
        const response = await axios.get(apiUrl);
        const data = response.data.data.map((item, index) => {
            const name = item.명칭 || item.의료기관명 || item.병원명 || item.상호명 || item.기관명 || '';
            const mapUrl = naverMapUrls[name] || '';
            const photoUrl = photoUrls[name] || '';
            return { ...item, id: index.toString(), mapUrl, photoUrl };
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
