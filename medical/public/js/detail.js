const API_BASE_URL = 'http://localhost:3000/fetch-data';

function getParamsFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        district: urlParams.get('district'),
        name: urlParams.get('name')
    };
}

function loadInstitutionDetails(district, name) {
    fetch(`${API_BASE_URL}/${district}`)
        .then(response => response.json())
        .then(data => {
            const institution = data.find(item => getInstitutionName(item, district) === name);
            if (institution) {
                displayInstitutionDetails(institution, district);
            } else {
                alert('해당 병원을 찾을 수 없습니다.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('데이터를 가져오는 중 문제가 발생했습니다.');
        });
}

function displayInstitutionDetails(institution, district) {
    const name = getInstitutionName(institution, district);
    const type = institution.구분 || institution.유형 || '';
    const phone = institution.전화번호 || institution.응급실연락처 || institution.의료기관전화번호 || institution.연락처;
    const address = institution.주소 || institution.지번주소 || institution.의료기관주소 || institution.도로명 || '';
    const mapUrl = institution.mapUrl || `https://map.naver.com/v5/search/${encodeURIComponent(address)}`;

    document.getElementById('detail-name').textContent = name;
    document.getElementById('detail-type').textContent = `분류: ${type}`;
    document.getElementById('detail-phone').textContent = `전화: ${phone}`;
    document.getElementById('detail-address').textContent = `주소: ${address}`;
    document.getElementById('detail-map').href = mapUrl;
    document.getElementById('detail-website').textContent = `웹사이트: ${institution.웹사이트 || '정보 없음'}`;
    document.getElementById('detail-hours').textContent = `운영 시간: ${institution.운영시간 || '정보 없음'}`;
    // 이미지 URL이 있는 경우 설정
    if (institution.사진) {
        document.getElementById('detail-photo').src = institution.사진;
    } else {
        document.getElementById('detail-photo').style.display = 'none';
    }
}

function getInstitutionName(institution, district) {
    switch (district) {
        case '부평구':
            return institution.명칭;
        case '서구':
            return institution.의료기관명;
        case '동구':
            return institution.병원명;
        case '계양구':
            return institution.의료기관명;
        case '미추홀구':
            return institution.상호명;
        case '중구':
            return institution.기관명;
        default:
            return '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const { district, name } = getParamsFromUrl();
    loadInstitutionDetails(district, name);
});
