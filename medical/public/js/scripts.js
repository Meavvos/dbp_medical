const API_BASE_URL = 'http://localhost:3000/fetch-data';

function loadDistrict(district) {
    fetch(`${API_BASE_URL}/${district}`)
        .then(response => response.json())
        .then(data => {
            displayInstitutionList(data, district);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayInstitutionList(institutions, district) {
    const institutionList = document.getElementById('institution-list');
    institutionList.innerHTML = '';
    institutions.forEach(institution => {
        const listItem = document.createElement('a');
        listItem.href = '#';
        listItem.className = 'list-group-item list-group-item-action';
        // 각 구의 필드 이름에 맞게 병원 이름을 참조합니다.
        const name = getInstitutionName(institution, district);
        listItem.textContent = name;
        listItem.onclick = () => showDetails(institution, district);
        institutionList.appendChild(listItem);
    });
    document.getElementById('institution-list').style.display = 'block';
    document.getElementById('institution-detail').style.display = 'none';
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

function showDetails(institution, district) {
    const name = getInstitutionName(institution, district);
    const type = institution.구분 || institution.유형 || '';
    const phone = institution.전화번호 || institution.응급실연락처 || institution.의료기관전화번호 || institution.연락처;
    const address = institution.주소 || institution.지번주소 || institution.의료기관주소 || institution.도로명 || '';

    document.getElementById('detail-name').textContent = name;
    document.getElementById('detail-type').textContent = `분류: ${type}`;
    document.getElementById('detail-phone').textContent = `전화: ${phone}`;
    document.getElementById('detail-address').textContent = `주소: ${address}`;
    document.getElementById('detail-map').href = `https://map.naver.com/v5/search/${encodeURIComponent(address)}`;

    document.getElementById('institution-list').style.display = 'none';
    document.getElementById('institution-detail').style.display = 'block';
}

function showList() {
    document.getElementById('institution-list').style.display = 'block';
    document.getElementById('institution-detail').style.display = 'none';
}
